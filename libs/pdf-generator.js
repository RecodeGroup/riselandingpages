/**
 * RisePDF — Lightweight branded PDF generator (no dependencies)
 * Generates valid PDF 1.4 files in the browser.
 * Supports JPEG images (DCTDecode) and PNG with alpha (FlateDecode + SMask).
 * RISE palette: dark foundations, orange (#ff683e) highlights, white details.
 */
const RisePDF = (() => {
  'use strict';

  const PAGE_W = 595.28;               // A4 width  in pt
  const PAGE_H = 841.89;               // A4 height in pt
  const MARGIN = { top: 80, right: 60, bottom: 80, left: 60 };
  const CONTENT_W = PAGE_W - MARGIN.left - MARGIN.right;

  // ── RISE Brand Colors (PDF RGB 0–1) ───────────────
  const CLR = {
    orange:    [0.992, 0.337, 0.165],   // #ff683e
    deepRed:   [0.498, 0.098, 0.000],   // #7f1900
    dark:      [0.118, 0.118, 0.118],   // #1e1e1e
    darkBg:    [0.078, 0.078, 0.078],   // #141414
    surface:   [0.147, 0.147, 0.147],   // #252525
    white:     [1.000, 1.000, 1.000],
    lightGray: [0.690, 0.690, 0.690],   // #b0b0b0
    midGray:   [0.651, 0.651, 0.651],   // #a6a6a6
    mutedGray: [0.440, 0.440, 0.440],   // #707070
    borderGray:[0.200, 0.200, 0.200],   // #333333
    coverBg:   [0.090, 0.090, 0.100],
    ctaBg:     [0.125, 0.125, 0.135],
  };

  // ── Helpers ──────────────────────────────────────────
  function encodeText(str) {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/[\u0080-\uFFFF]/g, function () { return '?'; });
  }

  function textWidth(str, fontSize) {
    return str.length * fontSize * 0.52;
  }

  function wrapText(str, fontSize, maxWidth) {
    var words = str.split(' ');
    var lines = [];
    var currentLine = '';
    for (var i = 0; i < words.length; i++) {
      var testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      if (textWidth(testLine, fontSize) > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // ── PDF Builder ─────────────────────────────────────
  function PDFBuilder() {
    this.pages = [];
    this.currentPageStreams = [];
    this.y = PAGE_H - MARGIN.top;
    this.pageStarted = false;
    this.imageObjects = [];    // [{type:'jpeg'|'png', data, width, height, alphaData?, rawLen?, alphaRawLen?}]
    this.pageAnnotations = [];
    this.currentAnnotations = [];
  }

  PDFBuilder.prototype._ensurePage = function () {
    if (!this.pageStarted) {
      this.currentPageStreams = [];
      this.pageStarted = true;
      this.y = PAGE_H - MARGIN.top;
    }
  };

  PDFBuilder.prototype._needSpace = function (height) {
    if (this.y - height < MARGIN.bottom) {
      this._finishPage();
      this._ensurePage();
    }
  };

  PDFBuilder.prototype._finishPage = function () {
    if (!this.pageStarted) return;
    this.pages.push(this.currentPageStreams.join('\n'));
    this.pageAnnotations.push(this.currentAnnotations);
    this.currentAnnotations = [];
    this.pageStarted = false;
  };

  PDFBuilder.prototype._stream = function (cmd) {
    this._ensurePage();
    this.currentPageStreams.push(cmd);
  };

  // ── Drawing primitives ──────────────────────────
  PDFBuilder.prototype.setColor = function (r, g, b) {
    this._stream(r.toFixed(3) + ' ' + g.toFixed(3) + ' ' + b.toFixed(3) + ' rg');
    this._stream(r.toFixed(3) + ' ' + g.toFixed(3) + ' ' + b.toFixed(3) + ' RG');
  };

  PDFBuilder.prototype.drawRect = function (x, y, w, h, r, g, b) {
    this._stream(r.toFixed(3) + ' ' + g.toFixed(3) + ' ' + b.toFixed(3) + ' rg');
    this._stream(x.toFixed(2) + ' ' + y.toFixed(2) + ' ' + w.toFixed(2) + ' ' + h.toFixed(2) + ' re f');
  };

  PDFBuilder.prototype.drawLine = function (x1, y1, x2, y2, r, g, b, lineWidth) {
    this._stream(r.toFixed(3) + ' ' + g.toFixed(3) + ' ' + b.toFixed(3) + ' RG');
    this._stream(lineWidth.toFixed(2) + ' w');
    this._stream(x1.toFixed(2) + ' ' + y1.toFixed(2) + ' m ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' l S');
  };

  PDFBuilder.prototype._textBlock = function (text, x, y, fontKey, fontSize) {
    var encoded = encodeText(text);
    this._stream('BT');
    this._stream(fontKey + ' ' + fontSize + ' Tf');
    this._stream(x.toFixed(2) + ' ' + y.toFixed(2) + ' Td');
    this._stream('(' + encoded + ') Tj');
    this._stream('ET');
  };

  // ── Image support ─────────────────────────────────
  // Register a JPEG image. Returns image index.
  PDFBuilder.prototype.registerImage = function (jpegBytes, width, height) {
    var idx = this.imageObjects.length;
    this.imageObjects.push({ type: 'jpeg', data: jpegBytes, width: width, height: height });
    return idx;
  };

  // Register a PNG image with alpha transparency (pre-compressed FlateDecode data).
  // rgbData and alphaData are binary strings of zlib-compressed pixel data.
  // rawRgbLen / rawAlphaLen are the uncompressed byte lengths.
  PDFBuilder.prototype.registerPNGImage = function (rgbData, alphaData, width, height, rawRgbLen, rawAlphaLen) {
    var idx = this.imageObjects.length;
    this.imageObjects.push({
      type: 'png',
      data: rgbData,
      alphaData: alphaData,
      width: width,
      height: height,
      rawLen: rawRgbLen,
      alphaRawLen: rawAlphaLen
    });
    return idx;
  };

  // Draw a registered image on the current page
  PDFBuilder.prototype.drawImage = function (imgIndex, x, y, displayW, displayH) {
    var name = '/Img' + imgIndex;
    this._stream('q');
    this._stream(displayW.toFixed(2) + ' 0 0 ' + displayH.toFixed(2) + ' ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' cm');
    this._stream(name + ' Do');
    this._stream('Q');
  };

  // ── High-level content methods ──────────────────

  // Cover page — dark background, orange accents, white title, optional photo
  PDFBuilder.prototype.addCoverPage = function (title, subtitle, brandName, logoImgIndex, photoImgIndex) {
    this._ensurePage();

    // Full dark background
    this.drawRect(0, 0, PAGE_W, PAGE_H, CLR.coverBg[0], CLR.coverBg[1], CLR.coverBg[2]);

    // Cover photo — top half, full width with overlay
    if (photoImgIndex !== undefined && photoImgIndex !== null && this.imageObjects[photoImgIndex]) {
      var photo = this.imageObjects[photoImgIndex];
      var photoW = PAGE_W;
      var photoH = (photo.height / photo.width) * photoW;
      if (photoH > PAGE_H * 0.45) { photoH = PAGE_H * 0.45; }
      this.drawImage(photoImgIndex, 0, PAGE_H - photoH, photoW, photoH);
    }

    // Top accent bar
    this.drawRect(0, PAGE_H - 5, PAGE_W, 5, CLR.orange[0], CLR.orange[1], CLR.orange[2]);

    // Logo top-left (supports transparent PNG)
    if (logoImgIndex !== undefined && logoImgIndex !== null && this.imageObjects[logoImgIndex]) {
      var img = this.imageObjects[logoImgIndex];
      var logoH = 42;
      var logoW = (img.width / img.height) * logoH;
      if (logoW > 140) { logoW = 140; logoH = (img.height / img.width) * logoW; }
      this.drawImage(logoImgIndex, MARGIN.left, PAGE_H - 32 - logoH, logoW, logoH);
    } else {
      this.setColor(CLR.lightGray[0], CLR.lightGray[1], CLR.lightGray[2]);
      this._textBlock(brandName || 'RISE', MARGIN.left, PAGE_H - 60, '/F2', 16);
    }

    // Title — large white text
    this.setColor(1, 1, 1);
    var titleLines = wrapText(title, 36, CONTENT_W);
    var ty = PAGE_H / 2 + 70;
    for (var i = 0; i < titleLines.length; i++) {
      this._textBlock(titleLines[i], MARGIN.left, ty, '/F2', 36);
      ty -= 48;
    }

    // Decorative line — below the title
    ty -= 4;
    this.drawLine(MARGIN.left, ty, MARGIN.left + 48, ty, CLR.orange[0], CLR.orange[1], CLR.orange[2], 2.5);
    ty -= 18;

    // Subtitle — lighter gray
    this.setColor(CLR.lightGray[0], CLR.lightGray[1], CLR.lightGray[2]);
    var subLines = wrapText(subtitle, 12.5, CONTENT_W);
    for (var j = 0; j < subLines.length; j++) {
      this._textBlock(subLines[j], MARGIN.left, ty, '/F1', 12.5);
      ty -= 18;
    }

    // Bottom section — tagline
    this.setColor(CLR.mutedGray[0], CLR.mutedGray[1], CLR.mutedGray[2]);
    this._textBlock('RISE Artist Academy', MARGIN.left, MARGIN.bottom + 30, '/F1', 9);

    // Bottom accent dot
    this.drawRect(MARGIN.left, MARGIN.bottom + 14, 20, 2, CLR.orange[0], CLR.orange[1], CLR.orange[2]);

    // Confidential footer
    this.setColor(CLR.mutedGray[0], CLR.mutedGray[1], CLR.mutedGray[2]);
    this._textBlock('Confidential', PAGE_W - MARGIN.right - 62, MARGIN.bottom - 10, '/F1', 8);

    this._finishPage();
  };

  // Page header with logo + top accent
  PDFBuilder.prototype.addPageHeader = function (brandName, logoImgIndex) {
    this._ensurePage();

    // Thin orange accent bar at top
    this.drawRect(0, PAGE_H - 3, PAGE_W, 3, CLR.orange[0], CLR.orange[1], CLR.orange[2]);

    // Logo or brand name
    if (logoImgIndex !== undefined && logoImgIndex !== null && this.imageObjects[logoImgIndex]) {
      var img = this.imageObjects[logoImgIndex];
      var logoH = 22;
      var logoW = (img.width / img.height) * logoH;
      if (logoW > 90) { logoW = 90; logoH = (img.height / img.width) * logoW; }
      this.drawImage(logoImgIndex, MARGIN.left, PAGE_H - 20 - logoH, logoW, logoH);
    } else {
      this.setColor(CLR.mutedGray[0], CLR.mutedGray[1], CLR.mutedGray[2]);
      this._textBlock(brandName || 'RISE', MARGIN.left, PAGE_H - 34, '/F2', 10);
    }

    // Adjust top margin to account for header
    this.y = PAGE_H - MARGIN.top - 10;
  };

  // Section heading
  PDFBuilder.prototype.addHeading = function (text, level) {
    var sizes = { 1: 20, 2: 13, 3: 11 };
    var fontSize = sizes[level] || 13;
    var lineHeight = fontSize * 1.45;

    this._ensurePage();
    this._needSpace(lineHeight + 20);

    // Spacing before
    this.y -= (level === 1 ? 32 : 14);

    // Orange accent bar for h1
    if (level === 1) {
      this.drawRect(MARGIN.left, this.y + 2, 36, 2.5, CLR.orange[0], CLR.orange[1], CLR.orange[2]);
      this.y -= 16;
    }

    // Dark heading text
    this.setColor(CLR.dark[0], CLR.dark[1], CLR.dark[2]);
    var lines = wrapText(text, fontSize, CONTENT_W);
    for (var i = 0; i < lines.length; i++) {
      this._needSpace(lineHeight);
      this._textBlock(lines[i], MARGIN.left, this.y, '/F2', fontSize);
      this.y -= lineHeight;
    }
    this.y -= 8;
  };

  // Body paragraph
  PDFBuilder.prototype.addParagraph = function (text, options) {
    options = options || {};
    var fontSize = options.fontSize || 10;
    var lineHeight = fontSize * 1.75;
    var indent = options.indent || 0;
    var maxW = CONTENT_W - indent;
    var color = options.color || [0.30, 0.30, 0.30];

    this._ensurePage();
    this.setColor(color[0], color[1], color[2]);

    var lines = wrapText(text, fontSize, maxW);
    for (var i = 0; i < lines.length; i++) {
      this._needSpace(lineHeight);
      this._textBlock(lines[i], MARGIN.left + indent, this.y, options.bold ? '/F2' : '/F1', fontSize);
      this.y -= lineHeight;
    }
    this.y -= 6;
  };

  // Bullet point
  PDFBuilder.prototype.addBullet = function (text) {
    var fontSize = 9;
    var lineHeight = fontSize * 1.6;
    var bulletX = MARGIN.left + 10;
    var textX = MARGIN.left + 26;
    var maxW = CONTENT_W - 26;

    this._ensurePage();

    var lines = wrapText(text, fontSize, maxW);
    this._needSpace(lineHeight);

    // Orange bullet circle
    this.drawRect(bulletX, this.y + 1.5, 5, 5, CLR.orange[0], CLR.orange[1], CLR.orange[2]);

    this.setColor(0.30, 0.30, 0.30);
    for (var i = 0; i < lines.length; i++) {
      this._needSpace(lineHeight);
      this._textBlock(lines[i], textX, this.y, '/F1', fontSize);
      this.y -= lineHeight;
    }
    this.y -= 2;
  };

  // Spacer
  PDFBuilder.prototype.addSpace = function (height) {
    this._ensurePage();
    this._needSpace(height);
    this.y -= height;
  };

  // Horizontal divider
  PDFBuilder.prototype.addDivider = function () {
    this._ensurePage();
    this._needSpace(28);
    this.y -= 14;
    this.drawLine(MARGIN.left, this.y, MARGIN.left + CONTENT_W, this.y, 0.85, 0.85, 0.85, 0.5);
    this.y -= 14;
  };

  // Call-to-action block with optional payment link
  PDFBuilder.prototype.addCTA = function (text, subtext, paymentUrl) {
    this._ensurePage();

    var hasLink = paymentUrl && paymentUrl.trim() !== '';
    var blockH = hasLink ? 80 : 75;
    this._needSpace(blockH + 24);
    this.y -= 12;

    // Subtle light background
    this.drawRect(MARGIN.left, this.y - blockH, CONTENT_W, blockH, 0.965, 0.965, 0.970);

    // Orange left accent bar
    this.drawRect(MARGIN.left, this.y - blockH, 3, blockH, CLR.orange[0], CLR.orange[1], CLR.orange[2]);

    // CTA heading
    this.setColor(CLR.dark[0], CLR.dark[1], CLR.dark[2]);
    var ctaLines = wrapText(text, 12, CONTENT_W - 50);
    var cy = this.y - 28;
    for (var i = 0; i < ctaLines.length; i++) {
      this._textBlock(ctaLines[i], MARGIN.left + 22, cy, '/F2', 12);
      cy -= 17;
    }

    // Subtext (brand tagline) + payment button on same row
    if (subtext) {
      cy -= 4;
      this.setColor(CLR.mutedGray[0], CLR.mutedGray[1], CLR.mutedGray[2]);
      this._textBlock(subtext, MARGIN.left + 22, cy, '/F1', 9);

      // Payment button — to the right of the subtext
      if (hasLink) {
        var subtextW = textWidth(subtext, 9);
        var btnX = MARGIN.left + 22 + subtextW + 16;
        var btnW = 90;
        var btnH = 20;
        var btnY = cy - 4;

        // Orange button background
        this.drawRect(btnX, btnY, btnW, btnH, CLR.orange[0], CLR.orange[1], CLR.orange[2]);

        // White button text centered
        this.setColor(1, 1, 1);
        var btnLabel = 'Payment';
        var btnLabelW = textWidth(btnLabel, 9);
        this._textBlock(btnLabel, btnX + (btnW - btnLabelW) / 2, btnY + 6, '/F2', 9);

        // Register clickable link annotation
        this.currentAnnotations.push({
          rect: [btnX, btnY, btnX + btnW, btnY + btnH],
          uri: paymentUrl
        });
      }
    }

    this.y -= blockH + 12;
  };

  // Footer — consistent on every content page
  PDFBuilder.prototype.addFooter = function (brandName) {
    var footerY = MARGIN.bottom - 30;
    this.drawLine(MARGIN.left, footerY + 14, PAGE_W - MARGIN.right, footerY + 14, 0.88, 0.88, 0.88, 0.4);
    this.setColor(CLR.mutedGray[0], CLR.mutedGray[1], CLR.mutedGray[2]);
    this._textBlock(brandName || 'RISE', MARGIN.left, footerY, '/F2', 7.5);
    this._textBlock('Confidential', PAGE_W - MARGIN.right - 52, footerY, '/F1', 7.5);
  };

  // New page
  PDFBuilder.prototype.newPage = function () {
    if (this.pageStarted) {
      this._finishPage();
    }
    this._ensurePage();
  };

  // ── Build final PDF ─────────────────────────────
  PDFBuilder.prototype.build = function () {
    if (this.pageStarted) {
      this._finishPage();
    }

    // Object numbering:
    // 1 = Catalog, 2 = Pages, 3 = Font Regular, 4 = Font Bold
    // Then image objects (JPEG = 1 obj, PNG = 2 objs: image + SMask)
    // Then annotation objects
    // Then page pairs: pageObj, streamObj

    var imgStartId = 5;

    // Calculate image object IDs — PNG images need 2 objects each
    var imgObjCount = 0;
    var imgObjMap = [];  // for each image: { mainId, smaskId? }
    for (var ii = 0; ii < this.imageObjects.length; ii++) {
      var imgInfo = this.imageObjects[ii];
      var mainId = imgStartId + imgObjCount;
      if (imgInfo.type === 'png') {
        var smaskId = mainId + 1;
        imgObjMap.push({ mainId: mainId, smaskId: smaskId });
        imgObjCount += 2;
      } else {
        imgObjMap.push({ mainId: mainId });
        imgObjCount += 1;
      }
    }

    var annotStartId = imgStartId + imgObjCount;

    // Count total annotation objects
    var totalAnnots = 0;
    for (var ai = 0; ai < this.pageAnnotations.length; ai++) {
      totalAnnots += this.pageAnnotations[ai].length;
    }

    var pageStartId = annotStartId + totalAnnots;

    // Calculate page object IDs
    var pageObjIds = [];
    var currentId = pageStartId;
    for (var i = 0; i < this.pages.length; i++) {
      pageObjIds.push(currentId);
      currentId += 2;
    }

    // Build image resource refs (always reference mainId)
    var imgResources = '';
    if (this.imageObjects.length > 0) {
      var imgParts = [];
      for (var im = 0; im < this.imageObjects.length; im++) {
        imgParts.push('/Img' + im + ' ' + imgObjMap[im].mainId + ' 0 R');
      }
      imgResources = ' /XObject << ' + imgParts.join(' ') + ' >>';
    }

    // Map annotation object IDs per page
    var pageAnnotIds = [];
    var annotId = annotStartId;
    for (var pa = 0; pa < this.pageAnnotations.length; pa++) {
      var ids = [];
      for (var a = 0; a < this.pageAnnotations[pa].length; a++) {
        ids.push(annotId);
        annotId++;
      }
      pageAnnotIds.push(ids);
    }

    // Assemble PDF
    var allLines = [];
    allLines.push('%PDF-1.4');
    allLines.push('%\xE2\xE3\xCF\xD3');

    var objOffsets = [];
    var currentStr = allLines.join('\n') + '\n';

    // Obj 1: Catalog
    objOffsets.push(currentStr.length);
    currentStr += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

    // Obj 2: Pages
    objOffsets.push(currentStr.length);
    var kids = pageObjIds.map(function (id) { return id + ' 0 R'; }).join(' ');
    currentStr += '2 0 obj\n<< /Type /Pages /Kids [' + kids + '] /Count ' + this.pages.length + ' >>\nendobj\n';

    // Obj 3: Helvetica
    objOffsets.push(currentStr.length);
    currentStr += '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n';

    // Obj 4: Helvetica-Bold
    objOffsets.push(currentStr.length);
    currentStr += '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n';

    // Image XObjects
    for (var img = 0; img < this.imageObjects.length; img++) {
      var imgObj = this.imageObjects[img];
      var map = imgObjMap[img];

      if (imgObj.type === 'png') {
        // PNG image: FlateDecode RGB with SMask for alpha
        var rgbData = imgObj.data;
        var alphaData = imgObj.alphaData;

        // SMask object (alpha channel) — write this SECOND but ref from main
        // Main image object
        objOffsets.push(currentStr.length);
        currentStr += map.mainId + ' 0 obj\n';
        currentStr += '<< /Type /XObject /Subtype /Image';
        currentStr += ' /Width ' + imgObj.width + ' /Height ' + imgObj.height;
        currentStr += ' /ColorSpace /DeviceRGB /BitsPerComponent 8';
        currentStr += ' /Filter /FlateDecode';
        currentStr += ' /Length ' + rgbData.length;
        currentStr += ' /SMask ' + map.smaskId + ' 0 R >>\n';
        currentStr += 'stream\n';
        currentStr += rgbData;
        currentStr += '\nendstream\n';
        currentStr += 'endobj\n';

        // SMask object (alpha channel)
        objOffsets.push(currentStr.length);
        currentStr += map.smaskId + ' 0 obj\n';
        currentStr += '<< /Type /XObject /Subtype /Image';
        currentStr += ' /Width ' + imgObj.width + ' /Height ' + imgObj.height;
        currentStr += ' /ColorSpace /DeviceGray /BitsPerComponent 8';
        currentStr += ' /Filter /FlateDecode';
        currentStr += ' /Length ' + alphaData.length + ' >>\n';
        currentStr += 'stream\n';
        currentStr += alphaData;
        currentStr += '\nendstream\n';
        currentStr += 'endobj\n';

      } else {
        // JPEG image: DCTDecode
        var jpegData = imgObj.data;
        objOffsets.push(currentStr.length);
        currentStr += map.mainId + ' 0 obj\n';
        currentStr += '<< /Type /XObject /Subtype /Image';
        currentStr += ' /Width ' + imgObj.width + ' /Height ' + imgObj.height;
        currentStr += ' /ColorSpace /DeviceRGB /BitsPerComponent 8';
        currentStr += ' /Filter /DCTDecode /Length ' + jpegData.length + ' >>\n';
        currentStr += 'stream\n';
        currentStr += jpegData;
        currentStr += '\nendstream\n';
        currentStr += 'endobj\n';
      }
    }

    // Annotation objects
    for (var ap = 0; ap < this.pageAnnotations.length; ap++) {
      for (var an = 0; an < this.pageAnnotations[ap].length; an++) {
        var annot = this.pageAnnotations[ap][an];
        var aId = pageAnnotIds[ap][an];
        var r = annot.rect;

        objOffsets.push(currentStr.length);
        currentStr += aId + ' 0 obj\n';
        currentStr += '<< /Type /Annot /Subtype /Link';
        currentStr += ' /Rect [' + r[0].toFixed(2) + ' ' + r[1].toFixed(2) + ' ' + r[2].toFixed(2) + ' ' + r[3].toFixed(2) + ']';
        currentStr += ' /Border [0 0 0]';
        currentStr += ' /A << /Type /Action /S /URI /URI (' + encodeText(annot.uri) + ') >> >>\n';
        currentStr += 'endobj\n';
      }
    }

    // Page objects
    var objNum = pageStartId;
    for (var p = 0; p < this.pages.length; p++) {
      var streamContent = this.pages[p];
      var streamBytes = new TextEncoder().encode(streamContent);
      var streamLen = streamBytes.length;

      // Build annotation refs for this page
      var annotRef = '';
      if (pageAnnotIds[p] && pageAnnotIds[p].length > 0) {
        annotRef = ' /Annots [' + pageAnnotIds[p].map(function (id) { return id + ' 0 R'; }).join(' ') + ']';
      }

      // Page object
      objOffsets.push(currentStr.length);
      currentStr += objNum + ' 0 obj\n';
      currentStr += '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PAGE_W + ' ' + PAGE_H + '] ';
      currentStr += '/Resources << /Font << /F1 3 0 R /F2 4 0 R >>' + imgResources + ' >> ';
      currentStr += '/Contents ' + (objNum + 1) + ' 0 R' + annotRef + ' >>\n';
      currentStr += 'endobj\n';
      objNum++;

      // Stream object
      objOffsets.push(currentStr.length);
      currentStr += objNum + ' 0 obj\n';
      currentStr += '<< /Length ' + streamLen + ' >>\n';
      currentStr += 'stream\n';
      currentStr += streamContent;
      currentStr += '\nendstream\n';
      currentStr += 'endobj\n';
      objNum++;
    }

    // Cross-reference table
    var xrefOffset = currentStr.length;
    var totalObjs = objNum - 1;
    currentStr += 'xref\n';
    currentStr += '0 ' + (totalObjs + 1) + '\n';
    currentStr += '0000000000 65535 f \n';

    for (var x = 0; x < objOffsets.length; x++) {
      var off = String(objOffsets[x]);
      while (off.length < 10) off = '0' + off;
      currentStr += off + ' 00000 n \n';
    }

    // Trailer
    currentStr += 'trailer\n';
    currentStr += '<< /Size ' + (totalObjs + 1) + ' /Root 1 0 R >>\n';
    currentStr += 'startxref\n';
    currentStr += xrefOffset + '\n';
    currentStr += '%%EOF\n';

    return currentStr;
  };

  // Download the PDF
  PDFBuilder.prototype.download = function (filename) {
    var pdfString = this.build();
    var bytes = new Uint8Array(pdfString.length);
    for (var i = 0; i < pdfString.length; i++) {
      bytes[i] = pdfString.charCodeAt(i) & 0xFF;
    }
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };

  return { PDFBuilder: PDFBuilder, PAGE_W: PAGE_W, PAGE_H: PAGE_H, MARGIN: MARGIN, CONTENT_W: CONTENT_W };
})();
