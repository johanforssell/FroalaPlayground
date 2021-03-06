/*!
 * froala_editor v2.0.0-rc.3 (https://www.froala.com/wysiwyg-editor/v2.0)
 * License http://editor.froala.com/license
 * Copyright 2014-2015 Froala Labs
 */
if ("undefined" == typeof jQuery) throw new Error("Froala requires jQuery");
!
function (jq) {
	"use strict";
	var b = function (c, d) {
		this.opts = jq.extend({}, b.DEFAULTS, jq(c).data(), "object" == typeof d && d), this.$original_element = jq(c), this.$original_element.data("froala.editor", this), this.id = ++jq.FroalaEditor.ID, this.original_document = c.ownerDocument, this.original_window = "defaultView" in this.original_document ? this.original_document.defaultView : this.original_document.parentWindow;
		var e = jq(this.original_window).scrollTop();

		this.$original_element.on("froala.doInit", jq.proxy(function () {
			this.$original_element.off("froala.doInit"), this.document = this.$el.get(0).ownerDocument, this.window = "defaultView" in this.document ? this.document.defaultView : this.document.parentWindow, this.$document = jq(this.document), this.$window = jq(this.window);
			var b;
			if (this.opts.initOnClick) b = this.load(jq.FroalaEditor.MODULES, this), this.tearUp(b, this), this.$el.on("mousedown.init dragenter.init focus.init", jq.proxy(function (c) {
				this.$el.off("mousedown.init dragenter.init focus.init"), this.tearUp(b, this);
				var d = this.load(jq.FroalaEditor.PLUGINS, this);
				this.tearUp(d, this);
				var e = c.originalEvent && c.originalEvent.originalTarget;
				e && "IMG" == e.tagName && jq(e).trigger("mousedown"), this.events.trigger("initialized")
			}, this));
			else {
				b = this.load(jq.FroalaEditor.MODULES, this), this.tearUp(b, this);
				var c = this.load(jq.FroalaEditor.PLUGINS, this);
				this.tearUp(c, this), jq(this.original_window).scrollTop(e), this.events.trigger("initialized")
			}
		}, this)), this._init()
	};

	b.DEFAULTS = {
		initOnClick: false
	},
	b.MODULES = {}, b.PLUGINS = {}, b.VERSION = "2.0.0", b.INSTANCES = [], b.ID = 0, b.prototype._init = function () {
		var b = this.$original_element.prop("tagName"),
			c = jq.proxy(function () {
				this._original_html = this._original_html || this.$original_element.html(), this.$box = this.$box || this.$original_element, this.opts.fullPage && (this.opts.iframe = true), this.opts.iframe ? (this.$iframe = jq('<iframe frameBorder="0">'), this.$wp = jq("<div></div>"), this.$box.html(this.$wp), this.$wp.append(this.$iframe), this.$iframe.get(0).contentWindow.document.open(), this.$iframe.get(0).contentWindow.document.write("<!DOCTYPE html>"), this.$iframe.get(0).contentWindow.document.write("<html><head></head><body></body></html>"), this.$iframe.get(0).contentWindow.document.close(), this.$el = this.$iframe.contents().find("body"), this.$head = this.$iframe.contents().find("head"), this.$html = this.$iframe.contents().find("html"), this.iframe_document = this.$iframe.get(0).contentWindow.document, this.$original_element.trigger("froala.doInit")) : (this.$el = jq("<div></div>"), this.$wp = jq("<div></div>").append(this.$el), this.$box.html(this.$wp), this.$original_element.trigger("froala.doInit"))
			}, this),
			d = jq.proxy(function () {
				this.$box = jq("<div>"), this.$original_element.before(this.$box).hide(), this._original_html = this.$original_element.val(), this.$original_element.parents("form").on("submit." + this.id, jq.proxy(function () {
					this.events.trigger("form.submit")
				}, this)), c()
			}, this),
			e = jq.proxy(function () {
				this.$el = this.$original_element, this.$el.attr("contenteditable", true).css("outline", "none"), this.opts.multiLine = false, this.$original_element.trigger("froala.doInit")
			}, this),
			f = jq.proxy(function () {
				this.$el = this.$original_element, this.$original_element.trigger("froala.doInit")
			}, this),
			g = jq.proxy(function () {
				this.$el = this.$original_element, this.$original_element.trigger("froala.doInit")
			}, this);
		this.opts.editInPopup ? g() : "TEXTAREA" == b ? d() : "A" == b ? e() : "IMG" == b ? f() : "DIV" == b ? c() : (this.opts.editInPopup = true, g())
	},
	b.prototype.load = function (a, b) {
		var c;
		for (c in a) b[c] = new a[c](this);
		var d, e, f = [],
			g = {};

		for (d in a) g[d] = [].concat(b[d].require || []);
		for (var h = false; !h;) {
			h = true;
			for (d in g) if (0 === g[d].length) {
				f.push(d), delete g[d], h = false;
				for (e in g) g[e].indexOf(d) >= 0 && g[e].splice(g[e].indexOf(d), 1);
				break
			}
		}
		if (h === true && Object.keys(g).length > 0) throw console.log(g), new Error("Module dependencies are cycling.");
		return f
	},
	b.prototype.tearUp = function (a, b) {
		for (var c = 0; c < a.length; c++) {
			var d = a[c];
			if (b[d]._init && !b[d].loaded && (b[d]._init(), b[d].loaded = true, this.opts.initOnClick && "core" == d)) return false
		}
	},
	b.prototype.destroy = function () {
		this.events.trigger("destroy"), this.$original_element.parents("form").off("submit." + this.id), this.$original_element.removeData("froala.editor")
	},
	jq.fn.froalaEditor = function (c) {
		for (var d = [], e = 0; e < arguments.length; e++) d.push(arguments[e]);
		if ("string" == typeof c) {
			var f = [];
			return this.each(function () {
				var b = jq(this),
					e = b.data("froala.editor");
				if (!e) return jq.error("Editor should be initialized before calling the " + c + " method.");
				var g, h;
				if (c.indexOf(".") > 0 && e[c.split(".")[0]] ? (e[c.split(".")[0]] && (g = e[c.split(".")[0]]), h = c.split(".")[1]) : (g = e, h = c.split(".")[0]), !g[h]) return jq.error("Method " + c + " does not exist in Froala Editor.");
				var i = g[h].apply(e, d.slice(1));
				void 0 === i ? f.push(this) : 0 === f.length && f.push(i)
			}), 1 == f.length ? f[0] : f
		}
		return "object" != typeof c && c ? void 0 : this.each(function () {
			var d = jq(this).data("froala.editor");
			d || new b(this, c)
		})
	},
	jq.fn.froalaEditor.Constructor = b,
	jq.FroalaEditor = b
} (jQuery), 

!
function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.data = function(a) {
		function b(a) {
			return a
		}
		function c(a) {
			if (!a) return a;
			for (var c = "", f = b("charCodeAt"), g = b("fromCharCode"), h = l.indexOf(a[0]), i = 1; i < a.length - 2; i++) {
				for (var j = d(++h), k = a[f](i), m = "";
				/[0-9-]/.test(a[i + 1]);) m += a[++i];
				m = parseInt(m, 10) || 0, k = e(k, j, m), k ^= h - 1 & 31, c += String[g](k)
			}
			return c
		}
		function d(a) {
			for (var b = a.toString(), c = 0, d = 0; d < b.length; d++) c += parseInt(b.charAt(d), 10);
			return c > 10 ? c % 9 + 1 : c
		}
		function e(a, b, c) {
			for (var d = Math.abs(c); d-- > 0;) a -= b;
			return 0 > c && (a += 123), a
		}
		function f(a) {
			return a && "none" == a.css("display") ? (a.remove(), true) : false
		}
		function g() {
			return f(j) || f(k)
		}
		function h() {
			return a.$box ? (a.$box.append(n(b(n("kTDD4spmKD1klaMB1C7A5RA1G3RA10YA5qhrjuvnmE1D3FD2bcG-7noHE6B2JB4C3xXA8WF6F-10RG2C3G3B-21zZE3C3H3xCA16NC4DC1f1hOF1MB3B-21whzQH5UA2WB10kc1C2F4D3XC2YD4D1C4F3GF2eJ2lfcD-13HF1IE1TC11TC7WE4TA4d1A2YA6XA4d1A3yCG2qmB-13GF4A1B1KH1HD2fzfbeQC3TD9VE4wd1H2A20A2B-22ujB3nBG2A13jBC10D3C2HD5D1H1KB11uD-16uWF2D4A3F-7C9D-17c1E4D4B3d1D2CA6B2B-13qlwzJF2NC2C-13E-11ND1A3xqUA8UE6bsrrF-7C-22ia1D2CF2H1E2akCD2OE1HH1dlKA6PA5jcyfzB-22cXB4f1C3qvdiC4gjGG2H2gklC3D-16wJC1UG4dgaWE2D5G4g1I2H3B7vkqrxH1H2EC9C3E4gdgzKF1OA1A5PF5C4WWC3VA6XA4e1E3YA2YA5HE4oGH4F2H2IB10D3D2NC5G1B1qWA9PD6PG5fQA13A10XA4C4A3e1H2BA17kC-22cmOB1lmoA2fyhcptwWA3RA8A-13xB-11nf1I3f1B7GB3aD3pavFC10D5gLF2OG1LSB2D9E7fQC1F4F3wpSB5XD3NkklhhaE-11naKA9BnIA6D1F5bQA3A10c1QC6Kjkvitc2B6BE3AF3E2DA6A4JD2IC1jgA-64MB11D6C4==")))), j = a.$box.find("> div:last"), void(k = j.find("> a"))) : false
		}
		function i() {
			var c = a.opts.key || [""];
			"string" == typeof c && (c = [c]), a.ul = true;
			for (var d = 0; d < c.length; d++) {
				var e = n(c[d]) || "";
				if (!(e !== n(b(n("mcVRDoB1BGILD7YFe1BTXBA7B6=="))) && e.indexOf(m, e.length - m.length) < 0 && [n("9qqG-7amjlwq=="), n("KA3B3C2A6D1D5H5H1A3==")].indexOf(m) < 0)) {
					a.ul = false;
					break
				}
			}
			a.ul === true && h(), a.events.on("contentChanged", function() {
				a.ul === true && g() && h()
			})
		}
		var j, k, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
			m = function() {
				for (var a = 0, b = document.domain, c = b.split("."), d = "_gd" + (new Date).getTime(); a < c.length - 1 && -1 == document.cookie.indexOf(d + "=" + d);) b = c.slice(-1 - ++a).join("."), document.cookie = d + "=" + d + ";domain=" + b + ";";
				return document.cookie = d + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + b + ";", b
			}(),
			n = b(c);
		return {
			require: ["core"],
			_init: i
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		htmlAllowedTags: ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "queue", "rp", "rt", "ruby", "s", "samp", "script", "style", "section", "select", "small", "source", "span", "strike", "strong", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "var", "video", "wbr"],
		htmlRemoveTags: ["script", "style"],
		htmlAllowedAttrs: ["accept", "accept-charset", "accesskey", "action", "align", "alt", "async", "autocomplete", "autofocus", "autoplay", "autosave", "background", "bgcolor", "border", "charset", "cellpadding", "cellspacing", "checked", "cite", "class", "color", "cols", "colspan", "content", "contenteditable", "contextmenu", "controls", "coords", "data", "data-.*", "datetime", "default", "defer", "dir", "dirname", "disabled", "download", "draggable", "dropzone", "enctype", "for", "form", "formaction", "headers", "height", "hidden", "high", "href", "hreflang", "http-equiv", "icon", "id", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "multiple", "name", "novalidate", "open", "optimum", "pattern", "ping", "placeholder", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "reversed", "rows", "rowspan", "sandbox", "scope", "scoped", "scrolling", "seamless", "selected", "shape", "size", "sizes", "span", "src", "srcdoc", "srclang", "srcset", "start", "step", "summary", "spellcheck", "style", "tabindex", "target", "title", "type", "translate", "usemap", "value", "valign", "width", "wrap"],
		htmlAllowComments: true,
		fullPage: false
	}), 
	jq.FroalaEditor.HTML5Map = {
		B: "STRONG",
		I: "EM",
		STRIKE: "S"
	}, 
	jq.FroalaEditor.MODULES.clean = function(b) {
		function c(a) {
			if (a.className && a.className.indexOf("fr-marker") >= 0) return false;
			var d, e = b.node.contents(a),
				f = [];
			for (d = 0; d < e.length; d++) e[d].className && e[d].className.indexOf("fr-marker") >= 0 && f.push(e[d]);
			if (e.length - f.length == 1 && 0 === a.textContent.replace(/\u200b/g, "").length) {
				for (d = 0; d < f.length; d++) a.parentNode.insertBefore(f[d].cloneNode(true), a);
				return a.parentNode.removeChild(a), false
			}
			for (d = 0; d < e.length; d++) e[d].nodeType == Node.ELEMENT_NODE ? e[d].textContent.replace(/\u200b/g, "").length != e[d].textContent.length && c(e[d]) : e[d].nodeType == Node.TEXT_NODE && (e[d].textContent = e[d].textContent.replace(/\u200b/g, ""))
		}
		function d(d) {
			if (d.replace(/\u200b/g, "").length == d.length) return d;
			if (d = e(d), b.opts.fullPage || (d = "<html><head></head><body>" + d + "</body></html>"), p = jq('<iframe style="width:0; height:0; position: absolute; left: -2000px; display: none;">'), jq("body").append(p), p.get(0).contentWindow.document.open(), p.get(0).contentWindow.document.write(d), p.get(0).contentWindow.document.close(), b.opts.fullPage) {
				k = p.contents().find("html").get(0), c(k);
				var g = b.html.getDoctype(p.get(0).contentWindow.document);
				return d = g + "<html" + b.node.attributes(k) + ">" + k.innerHTML + "</html>", p.remove(), f(d)
			}
			return q = p.get(0).contentDocument.getElementsByTagName("body")[0], c(q), d = q.innerHTML, p.remove(), f(d)
		}
		function e(a) {
			return u = [], a = a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, function(a) {
				return u.push(a), "<!--[FROALA.EDITOR.SCRIPT " + (u.length - 1) + "]-->"
			}), a = a.replace(/<img((?:[\w\W]*?)) src="/g, '<img$1 data-src="')
		}
		function f(a) {
			return a = a.replace(/<!--\[FROALA\.EDITOR\.SCRIPT ([\d]*)]-->/gi, function(a, b) {
				return u[parseInt(b, 10)]
			}), b.opts.htmlRemoveTags.indexOf("script") >= 0 && (a = a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")), a = a.replace(/<img((?:[\w\W]*?)) data-src="/g, '<img$1 src="')
		}
		function g() {
			var c = b.$el.find(Object.keys(jq.FroalaEditor.HTML5Map).join(",")).filter(function() {
				return "" === b.node.attributes(this)
			});
			
			c.length && (b.selection.save(), c.each(function() {
				jq(this).replaceWith("<" + jq.FroalaEditor.HTML5Map[this.tagName] + ">" + jq(this).html() + "</" + jq.FroalaEditor.HTML5Map[this.tagName] + ">")
			}), b.selection.restore())
		}
		function h(c) {
			if ("PRE" == c.tagName && j(c), c.nodeType == Node.TEXT_NODE || c.nodeType == Node.ELEMENT_NODE && (c.getAttribute("src") && c.setAttribute("src", b.helpers.sanitizeURL(c.getAttribute("src"))), c.getAttribute("href") && c.setAttribute("href", b.helpers.sanitizeURL(c.getAttribute("href"))), ["TABLE", "TBODY", "TFOOT", "TR"].indexOf(c.tagName) >= 0 && (c.innerHTML = c.innerHTML.trim())), c.nodeType == Node.ELEMENT_NODE && jq.FroalaEditor.HTML5Map[c.tagName] && "" === b.node.attributes(c)) {
				var d = jq.FroalaEditor.HTML5Map[c.tagName],
					e = "<" + d + ">" + c.innerHTML + "</" + d + ">";
				c.insertAdjacentHTML("beforebegin", e), c = c.previousSibling, c.parentNode.removeChild(c.nextSibling)
			}
			if (b.opts.htmlAllowComments || c.nodeType != Node.COMMENT_NODE) if (c.tagName && c.tagName.match(s)) c.parentNode.removeChild(c);
			else if (c.tagName && !c.tagName.match(r)) c.outerHTML = c.innerHTML;
			else {
				var f = c.attributes;
				if (f) for (var g = f.length - 1; g >= 0; g--) {
					var h = f[g];
					h.nodeName.match(t) || c.removeAttribute(h.nodeName)
				}
			} else 0 !== c.data.indexOf("[FROALA.EDITOR") && c.parentNode.removeChild(c)
		}
		function i(a) {
			for (var c = b.node.contents(a), d = 0; d < c.length; d++) c[d].nodeType != Node.TEXT_NODE ? i(c[d]) : h(c[d]);
			("BODY" != a.tagName || b.opts.fullPage) && h(a)
		}
		function j(a) {
			var b = a.innerHTML;
			b.indexOf("\n") >= 0 && (a.innerHTML = b.replace(/\n/g, "<br>"))
		}
		function k(c, d, g, h) {
			"undefined" == typeof d && (d = []), "undefined" == typeof g && (g = []), "undefined" == typeof h && (h = false), c = c.replace(/\u0009/g, "");
			var j, k = jq.merge([], b.opts.htmlAllowedTags);
			for (j = 0; j < d.length; j++) k.indexOf(d[j]) >= 0 && k.splice(k.indexOf(d[j]), 1);
			var l = jq.merge([], b.opts.htmlAllowedAttrs);
			for (j = 0; j < g.length; j++) l.indexOf(g[j]) >= 0 && l.splice(l.indexOf(g[j]), 1);
			if (r = new RegExp("^" + k.join("$|^") + "$", "gi"), t = new RegExp("^" + l.join("$|^") + "$", "gi"), s = new RegExp("^" + b.opts.htmlRemoveTags.join("$|^") + "$", "gi"), c = e(c), b.opts.fullPage || (c = "<html><head></head><body>" + c + "</body></html>"), p = jq('<iframe style="width:0; height:0; position: absolute; left: -2000px; display: none;">'), jq("body").append(p), p.get(0).contentWindow.document.open(), p.get(0).contentWindow.document.write(c), p.get(0).contentWindow.document.close(), b.opts.fullPage && h) {
				var m = p.contents().find("html").get(0);
				i(m);
				var n = b.html.getDoctype(p.get(0).contentWindow.document);
				return c = n + "<html" + b.node.attributes(m) + ">" + m.innerHTML + "</html>", p.remove(), f(c)
			}
			return q = p.get(0).contentDocument.getElementsByTagName("body")[0], i(q), c = q.innerHTML, p.remove(), f(c)
		}
		function l() {
			for (var c = b.$el.find("blockquote + blockquote"), d = 0; d < c.length; d++) {
				var e = jq(c[d]);
				b.node.attributes(c[d]) == b.node.attributes(e.prev().get(0)) && (e.prev().append(e.html()), e.remove())
			}
		}
		function m() {
			for (var c = b.$el.find("tr").filter(function() {
				return jq(this).find("th").length > 0
			}), d = 0; d < c.length; d++) {
				var e = jq(c[d]).closest("table").find("thead");
				0 === e.length && (e = jq("<thead>"), jq(c[d]).closest("table").prepend(e)), e.append(c[d])
			}
			b.$el.find("table").filter(function() {
				var a = this.previousSibling;
				return a && !b.node.isBlock(a) && "BR" != a.tagName ? true : false
			}).before("<br>"), b.$el.find("td > p, th > p").each(function() {
				jq(this).replaceWith(this.innerHTML + "<br>")
			})
		}
		function n() {
			for (var c = b.$el.find("ol + ol, ul + ul"), d = 0; d < c.length; d++) {
				var e = jq(c[d]);
				b.node.attributes(c[d]) == b.node.attributes(e.prev().get(0)) && (e.prev().append(e.html()), e.remove())
			}
			var f = [],
				g = function() {
					return !b.node.isList(this.parentNode)
				};
			
			do {
				if (f.length) {
					var h = f.get(0),
						i = jq("<ul></ul>").insertBefore(jq(h));
					do {
						var j = h;
						h = h.nextSibling, i.append(jq(j))
					} while 
					(h && "LI" == h.tagName)
				}
				f = b.$el.find("li").filter(g)
			} while 
			(f.length > 0);
			var k, l = function(b, c) {
				var d = jq(c);
				0 === d.find("LI").length && (k = true, d.remove())
			};
			
			do k = false, b.$el.find("li:empty").remove(), b.$el.find("ul, ol").each(l);
			while (k === true);
			for (var m = b.$el.find("ol, ul").find("> ul, > ol"), n = 0; n < m.length; n++) {
				var o = m[n],
					p = o.previousSibling;
				p && ("LI" == p.tagName ? jq(p).append(o) : jq(o).wrap("<li></li>"))
			}
			b.$el.find("li > ul, li > ol").each(function(b, c) {
				if (c.nextSibling) {
					var d = c.nextSibling,
						e = jq("<li>");
					jq(c.parentNode).after(e);
					do {
						var f = d;
						d = d.nextSibling, e.append(f)
					} while 
					(d)
				}
			}), b.$el.find("li > ul, li > ol").each(function(c, d) {
				if (b.node.isFirstSibling(d)) jq(d).before("<br/>");
				else if (d.previousSibling && "BR" == d.previousSibling.tagName) {
					for (var e = d.previousSibling.previousSibling; e && jq(e).hasClass("fr-marker");) e = e.previousSibling;
					e && "BR" != e.tagName && jq(d.previousSibling).remove()
				}
			}), b.$el.find("li:empty").remove()
		}
		function o() {
			b.opts.fullPage && jq.merge(b.opts.htmlAllowedTags, ["head", "title", "style", "link", "base", "body", "html"])
		}
		var p, q, r, s, t, u = [];
		return {
			require: ["node"],
			_init: o,
			html: k,
			toHTML5: g,
			tables: m,
			lists: n,
			quotes: l,
			invisibleSpaces: d
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.COMMANDS = {
		bold: {
			title: "Bold"
		},
		
		italic: {
			title: "Italic"
		},
		
		underline: {
			title: "Underline"
		},
		
		strikeThrough: {
			title: "Strikethrough"
		},
		
		subscript: {
			title: "Subscript"
		},
		
		superscript: {
			title: "Superscript"
		},
		
		outdent: {
			title: "Decrease Indent"
		},
		
		indent: {
			title: "Increase Indent"
		},
		
		undo: {
			title: "Undo",
			undo: false,
			forcedRefresh: true
		},
		
		redo: {
			title: "Redo",
			undo: false,
			forcedRefresh: true
		},
		
		insertHR: {
			title: "Insert Horizontal Line",
			undo: true
		},
		
		clearFormatting: {
			title: "Clear formatting",
			undo: true
		},
		
		selectAll: {
			title: "Select All",
			undo: false
		}
	}, 
	jq.FroalaEditor.RegisterCommand = function(b, c) {
		jq.FroalaEditor.COMMANDS[b] = c
	}, 
	jq.FroalaEditor.MODULES.commands = function(b) {
		function c(c, d) {
			if (b.events.trigger("commands.before", jq.merge([c], d || [])) !== false) {
				var e = jq.FroalaEditor.COMMANDS[c] && jq.FroalaEditor.COMMANDS[c].callback || k[c],
					f = true;
				jq.FroalaEditor.COMMANDS[c] && "undefined" != typeof jq.FroalaEditor.COMMANDS[c].focus && (f = jq.FroalaEditor.COMMANDS[c].focus), !b.core.hasFocus() && f && b.events.focus(true), jq.FroalaEditor.COMMANDS[c] && jq.FroalaEditor.COMMANDS[c].undo !== false && b.undo.saveStep(), e && e.apply(b, jq.merge([c], d || [])), b.events.trigger("commands.after", jq.merge([c], d || [])), jq.FroalaEditor.COMMANDS[c] && jq.FroalaEditor.COMMANDS[c].undo !== false && b.undo.saveStep()
			}
		}
		function d(c, d) {
			if (b.selection.isCollapsed() && b.document.queryCommandState(c) === false) {
				b.markers.insert();
				
				var e = b.$el.find(".fr-marker");
				e.replaceWith("<" + d + ">" + jq.FroalaEditor.INVISIBLE_SPACE + jq.FroalaEditor.MARKERS + "</" + d + ">"), b.selection.restore()
			} else {
				var f = b.selection.element();
				
				if (b.selection.isCollapsed() && b.document.queryCommandState(c) === true && f.tagName == d.toUpperCase() && 0 === (f.textContent || "").replace(/\u200B/g, "").length) jq(f).replaceWith(jq.FroalaEditor.MARKERS), b.selection.restore();
				else {
					!b.selection.isCollapsed() && b.browser.mozilla && b.selection.save();
					
					var g = b.$el.find("span");
					b.document.execCommand(c, false, false);
					var h = b.$el.find("span[style]").not(g).filter(function() {
						return jq(this).attr("style").indexOf("font-weight: normal") >= 0
					});
					
					h.length && (b.selection.save(), h.each(function() {
						jq(this).replaceWith(jq(this).html())
					}), b.selection.restore()), !b.selection.isCollapsed() && b.browser.mozilla && b.selection.restore(), b.clean.toHTML5()
				}
			}
		}
		function e(c) {
			b.selection.save(), b.html.wrap(true, true), b.selection.restore();
			
			for (var d = b.selection.blocks(), e = "rtl" == b.opts.direction ? "margin-right" : "margin-left", f = 0; f < d.length; f++) if ("LI" != d[f].tagName && "LI" != d[f].parentNode.tagName) {
				var g = jq(d[f]),
					h = b.helpers.getPX(g.css(e));
				g.css(e, Math.max(h + 20 * c, 0) || ""), g.removeClass("fr-temp-div")
			}
			b.selection.save(), b.html.unwrap(), b.selection.restore()
		}
		function f() {
			if (b.browser.webkit) {
				var c = function(a) {
					return a.attr("style").indexOf("font-size") >= 0
				};
				
				b.$el.find("[style]").each(function() {
					var b = jq(this);
					c(b) && (b.attr("data-font-size", b.css("font-size")), b.css("font-size", ""))
				})
			}
		}
		function g() {
			b.browser.webkit && b.$el.find("[data-font-size]").each(function() {
				var b = jq(this);
				b.css("font-size", b.attr("data-font-size")), b.removeAttr("data-font-size")
			})
		}
		function h() {
			b.$el.find("span").each(function() {
				"" === b.node.attributes(this) && jq(this).replaceWith(jq(this).html())
			})
		}
		function i(c, d) {
			if (b.selection.isCollapsed()) {
				b.markers.insert();
				
				var e = b.$el.find(".fr-marker");
				e.replaceWith('<span style="' + c + ": " + d + ';">' + jq.FroalaEditor.INVISIBLE_SPACE + jq.FroalaEditor.MARKERS + "</span>"), b.selection.restore()
			} else {
				f(), b.document.execCommand("fontSize", false, 4), b.selection.save(), g();
				
				for (var i, j = function(b) {
					var d = jq(b);
					d.css(c, ""), "" === d.attr("style") && d.replaceWith(d.html())
				}, k = function() {
					return 0 === jq(this).attr("style").indexOf(c + ":") || jq(this).attr("style").indexOf(";" + c + ":") >= 0 || jq(this).attr("style").indexOf("; " + c + ":") >= 0
				}; b.$el.find("font").length > 0;) {
					var l = b.$el.find("font:first"),
						m = jq('<span class="fr-just" style="' + c + ": " + d + ';">' + l.html() + "</span>");
					l.replaceWith(m);
					var n = m.find("span");
					for (i = n.length - 1; i >= 0; i--) j(n[i]);
					var o = m.parentsUntil(b.$el, "span:first").filter(k);
					if (o.length) {
						var p = "",
							q = "",
							r = "",
							s = "",
							t = m.get(0);
						do t = t.parentNode, p += b.node.closeTagString(t), q = b.node.openTagString(t) + q, o.get(0) != t && (r += b.node.closeTagString(t), s = b.node.openTagString(t) + s);
						while (o.get(0) != t);
						var u = p + '<span class="fr-just" style="' + c + ": " + d + ';">' + s + m.html() + r + "</span>" + q;
						m.replaceWith('<span id="fr-break"></span>');
						var v = o.get(0).outerHTML;
						o.replaceWith(v.replace(/<span id="fr-break"><\/span>/g, u))
					}
				}
				b.html.cleanEmptyTags(), h();
				
				var w = b.$el.find(".fr-just + .fr-just");
				for (i = 0; i < w.length; i++) {
					var x = jq(w[i]);
					x.prepend(x.prev().html()), x.prev().remove()
				}
				b.$el.find(".fr-marker + .fr-just").each(function() {
					jq(this).prepend(jq(this).prev())
				}), b.$el.find(".fr-just + .fr-marker").each(function() {
					jq(this).append(jq(this).next())
				}), b.$el.find(".fr-just").removeAttr("class"), b.selection.restore()
			}
		}
		function j(a) {
			return function() {
				c(a)
			}
		}
		var k = {
			bold: function() {
				d("bold", "strong")
			},
			
			subscript: function() {
				d("subscript", "sub")
			},
			
			superscript: function() {
				d("superscript", "sup")
			},
			
			italic: function() {
				d("italic", "em")
			},
			
			strikeThrough: function() {
				d("strikeThrough", "s")
			},
			
			underline: function() {
				d("underline", "u")
			},
			
			undo: function() {
				b.undo.run()
			},
			
			redo: function() {
				b.undo.redo()
			},
			
			indent: function() {
				e(1)
			},
			
			outdent: function() {
				e(-1)
			},
			
			show: function() {
				b.opts.toolbarInline && b.toolbar.showInline(null, true)
			},
			
			insertHR: function() {
				b.selection.remove(), b.html.insert('<hr id="fr-just">');
				var a = b.$el.find("hr#fr-just");
				a.removeAttr("id"), b.selection.setAfter(a.get(0)) || b.selection.setBefore(a.get(0)), b.selection.restore()
			},
			
			clearFormatting: function() {
				b.document.execCommand("removeFormat", false, false), b.document.execCommand("unlink", false, false)
			},
			
			selectAll: function() {
				b.document.execCommand("selectAll", false, false)
			}
		},
			l = {};
		
		for (var m in k) l[m] = j(m);
		return jq.extend(l, {
			require: ["events", "core"],
			exec: c,
			applyProperty: i
		})
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		editorClass: null,
		typingTimer: 500,
		iframe: false,
		requestWithCORS: true,
		requestHeaders: {},
		
		useClasses: true,
		spellcheck: true,
		iframeStyle: 'html{margin: 0px;}body{padding:10px;background:transparent;color:#000000;position:relative;z-index: 2;-webkit-user-select:auto;margin:0px}body:after{content:"";clear:both;display:block}hr{clear:both;user-select:none;-o-user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;}pre{white-space:pre-wrap;word-wrap: break-word;}',
		direction: "auto",
		zIndex: 1,
		disableRightClick: false,
		scrollableContainer: "body",
		keepFormatOnDelete: false
	}), 
	jq.FroalaEditor.MODULES.core = function(b) {
		function c(a) {
			b.opts.iframe && b.$head.append('<style data-fr-style="true">' + a + "</style>")
		}
		function d() {
			b.opts.iframe || b.$el.addClass("fr-element fr-view")
		}
		function e() {
			b.$box.addClass("fr-box" + (b.opts.editorClass ? " " + b.opts.editorClass : "")), b.$wp.addClass("fr-wrapper"), d(), b.opts.iframe && b.$iframe.addClass("fr-iframe"), "auto" != b.opts.direction && b.$box.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), b.$el.attr("dir", b.opts.direction), b.opts.zIndex > 1 && b.$box.css("z-index", b.opts.zIndex), b.$box && b.opts.theme && b.$box.addClass(b.opts.theme + "-theme")
		}
		function f() {
			return b.node.isEmpty(b.$el.get(0))
		}
		function g() {
			b.drag_support = {
				filereader: "undefined" != typeof FileReader,
				formdata: !! b.window.FormData,
				progress: "upload" in new XMLHttpRequest
			}
		}
		function h(a, c) {
			var d = new XMLHttpRequest;
			d.open(c, a, true), b.opts.requestWithCORS && (d.withCredentials = true);
			for (var e in b.opts.requestHeaders) d.setRequestHeader(e, b.opts.requestHeaders[e]);
			return d
		}
		function i() {
			"TEXTAREA" == b.$original_element.get(0).tagName && b.$original_element.val(b.html.get()), b.$wp && ("TEXTAREA" == b.$original_element.get(0).tagName ? (b.$box.replaceWith(b.$original_element), b.$original_element.show()) : (b.$el.off("contextmenu.rightClick"), b.$wp.replaceWith(b.html.get()), b.$box.removeClass("fr-view fr-ltr fr-box " + (b.opts.editorClass || "")), b.opts.theme && b.$box.addClass(b.opts.theme + "-theme")))
		}
		function j() {
			return b.node.hasFocus(b.$el.get(0))
		}
		function k() {
			if (jq.FroalaEditor.INSTANCES.push(b), g(), b.$wp) {
				b.html.set(b._original_html), e(), b.$el.attr("spellcheck", b.opts.spellcheck), b.helpers.isMobile() && (b.$el.attr("autocomplete", b.opts.spellcheck ? "on" : "off"), b.$el.attr("autocorrect", b.opts.spellcheck ? "on" : "off"), b.$el.attr("autocapitalize", b.opts.spellcheck ? "on" : "off")), b.opts.disableRightClick && b.$el.on("contextmenu.rightClick", function(a) {
					return 2 == a.button ? false : void 0
				});
				
				try {
					b.document.execCommand("styleWithCSS", false, false)
				} catch (c) {}
			}
			b.events.trigger("init"), b.events.on("destroy", i), "TEXTAREA" == b.$original_element.get(0).tagName && (b.events.on("contentChanged", function() {
				b.$original_element.val(b.html.get())
			}), b.$original_element.val(b.html.get()))
		}
		return {
			require: ["node", "html", "size", "placeholder"],
			_init: k,
			isEmpty: f,
			getXHR: h,
			injectStyle: c,
			hasFocus: j
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.NO_DELETE_TAGS = ["TH", "TD", "TABLE"], 
	jq.FroalaEditor.SIMPLE_ENTER_TAGS = ["TH", "TD", "LI"], 
	jq.FroalaEditor.MODULES.cursor = function(html_contents) {
		function isAtEndSimple(a) {
			return html_contents.node.isBlock(a) ? true : a.nextSibling ? false : isAtEndSimple(a.parentNode)
		}
		function isAtStartSimple(a) {
			return html_contents.node.isBlock(a) ? true : a.previousSibling ? false : isAtStartSimple(a.parentNode)
		}
		function isAtStart(a, c) {
			return a ? a == html_contents.$wp.get(0) ? false : a.previousSibling ? false : a.parentNode == c ? true : isAtStart(a.parentNode, c) : false
		}
		function isAtEnd(a, c) {
			return a ? a == html_contents.$wp.get(0) ? false : a.nextSibling ? false : a.parentNode == c ? true : isAtEnd(a.parentNode, c) : false
		}
		function g(c) {
			return jq(c).parentsUntil(html_contents.$el, "LI").length > 0 && 0 === jq(c).parentsUntil("LI", "TABLE").length
		}
		function h(c) {
			var d = jq(c).parentsUntil(html_contents.$el, "BLOCKQUOTE").length > 0,
				e = html_contents.node.deepestParent(c, [], !d);
			if (e && "BLOCKQUOTE" == e.tagName) {
				var f = html_contents.node.deepestParent(c, [jq(c).parentsUntil(html_contents.$el, "BLOCKQUOTE").get(0)]);
				f && f.previousSibling && (e = f)
			}
			if (null !== e) {
				var g, h = e.previousSibling;
				if (html_contents.node.isBlock(e) && h && jq.FroalaEditor.NO_DELETE_TAGS.indexOf(h.tagName) < 0) if (html_contents.node.isBlock(h)) if (html_contents.node.isEmpty(h) && !html_contents.node.isList(h)) jq(h).remove();
				else {
					if (html_contents.node.isList(h) && (h = jq(h).find("li:last").get(0)), g = html_contents.node.contents(h), g.length && "BR" == g[g.length - 1].tagName && jq(g[g.length - 1]).remove(), "BLOCKQUOTE" == h.tagName && "BLOCKQUOTE" != e.tagName) for (g = html_contents.node.contents(h); g.length && html_contents.node.isBlock(g[g.length - 1]);) h = g[g.length - 1], g = html_contents.node.contents(h);
					else if ("BLOCKQUOTE" != h.tagName && "BLOCKQUOTE" == e.tagName) for (g = html_contents.node.contents(e); g.length && html_contents.node.isBlock(g[0]);) e = g[0], g = html_contents.node.contents(e);
					jq(c).replaceWith(jq.FroalaEditor.MARKERS), jq(h).append(e.innerHTML), jq(e).remove()
				} else jq(c).replaceWith(jq.FroalaEditor.MARKERS), "BLOCKQUOTE" == e.tagName && h.nodeType == Node.ELEMENT_NODE ? jq(h).remove() : (jq(h).after(html_contents.node.isEmpty(e) ? "" : jq(e).html()), jq(e).remove(), "BR" == h.tagName && jq(h).remove())
			}
		}
		function i(c) {
			for (var d = c; !d.previousSibling;) d = d.parentNode;
			d = d.previousSibling;
			var e;
			if (html_contents.node.isBlock(d)) {
				if (jq.FroalaEditor.NO_DELETE_TAGS.indexOf(d.tagName) < 0) if (html_contents.node.isEmpty(d) && !html_contents.node.isList(d)) jq(d).remove(), jq(c).replaceWith(jq.FroalaEditor.MARKERS);
				else {
					for (html_contents.node.isList(d) && (d = jq(d).find("li:last").get(0)), e = html_contents.node.contents(d), e && "BR" == e[e.length - 1].tagName && jq(e[e.length - 1]).remove(), e = html_contents.node.contents(d); e && html_contents.node.isBlock(e[e.length - 1]);) d = e[e.length - 1], e = html_contents.node.contents(d);
					jq(d).append(jq.FroalaEditor.MARKERS);
					for (var f = c; !f.previousSibling;) f = f.parentNode;
					for (; f && "BR" !== f.tagName && !html_contents.node.isBlock(f);) {
						var g = f;
						f = f.nextSibling, jq(d).append(g)
					}
					f && "BR" == f.tagName && jq(f).remove(), jq(c).remove()
				}
			} else {
				for (e = html_contents.node.contents(d); d.nodeType != Node.TEXT_NODE && e.length && !jq(d).is("[contenteditable='false']");) d = e[e.length - 1], e = html_contents.node.contents(d);
				d.nodeType == Node.TEXT_NODE ? (jq(d).after(jq.FroalaEditor.MARKERS), d.textContent = d.textContent.substring(0, d.length - 1), d.textContent.length && 55357 == d.textContent.charCodeAt(d.textContent.length - 1) && (d.textContent = d.textContent.substr(0, d.textContent.length - 1))) : html_contents.events.trigger("node.remove", [jq(d)]) !== false && (jq(d).after(jq.FroalaEditor.MARKERS), jq(d).remove())
			}
		}
		function backspace() {
			var f = html_contents.markers.insert();
			
			html_contents.$el.get(0).normalize();
			
			var j = f.previousSibling;
			if (j) {
				var k = j.textContent;
				k && k.length && 8203 == k.charCodeAt(k.length - 1) && (1 == k.length ? jq(j).remove() : (j.textContent = j.textContent.substr(0, k.length - 1), j.textContent.length && 55357 == j.textContent.charCodeAt(j.textContent.length - 1) && (j.textContent = j.textContent.substr(0, j.textContent.length - 1))))
			}
			isAtEndSimple(f) ? i(f) : isAtStartSimple(f) ? g(f) && isAtStart(f, jq(f).parents("li:first").get(0)) ? html_contents.cursorLists._backspace(f) : h(f) : i(f), jq(f).remove(), html_contents.$el.find("blockquote:empty").remove(), html_contents.html.fillEmptyBlocks(true), html_contents.html.cleanEmptyTags(true), html_contents.clean.quotes(), html_contents.clean.lists(), html_contents.html.normalizeSpaces(), html_contents.selection.restore()
		}
		function k(c) {
			var d = jq(c).parentsUntil(html_contents.$el, "BLOCKQUOTE").length > 0,
				e = html_contents.node.deepestParent(c, [], !d);
			if (e && "BLOCKQUOTE" == e.tagName) {
				var f = html_contents.node.deepestParent(c, [jq(c).parentsUntil(html_contents.$el, "BLOCKQUOTE").get(0)]);
				f && f.nextSibling && (e = f)
			}
			if (null !== e) {
				var g, h = e.nextSibling;
				if (html_contents.node.isBlock(e) && h && jq.FroalaEditor.NO_DELETE_TAGS.indexOf(h.tagName) < 0) if (html_contents.node.isBlock(h)) if (html_contents.node.isList(h)) if (html_contents.node.isEmpty(e, true)) jq(e).remove(), jq(h).find("li:first").prepend(jq.FroalaEditor.MARKERS);
				else {
					var i = jq(h).find("li:first");
					"BLOCKQUOTE" == e.tagName && (g = html_contents.node.contents(e), g.length && html_contents.node.isBlock(g[g.length - 1]) && (e = g[g.length - 1])), 0 === i.find("ul, ol").length && (jq(c).replaceWith(jq.FroalaEditor.MARKERS), i.find(html_contents.html.blockTagsQuery()).not("ol, ul, table").each(function() {
						this.parentNode == i.get(0) && jq(this).replaceWith(jq(this).html() + (html_contents.node.isEmpty(this) ? "" : "<br>"))
					}), jq(e).append(html_contents.node.contents(i.get(0))), i.remove(), 0 === jq(h).find("li").length && jq(h).remove())
				} else {
					if (g = html_contents.node.contents(h), g.length && "BR" == g[0].tagName && jq(g[0]).remove(), "BLOCKQUOTE" != h.tagName && "BLOCKQUOTE" == e.tagName) for (g = html_contents.node.contents(e); g.length && html_contents.node.isBlock(g[g.length - 1]);) e = g[g.length - 1], g = html_contents.node.contents(e);
					else if ("BLOCKQUOTE" == h.tagName && "BLOCKQUOTE" != e.tagName) for (g = html_contents.node.contents(h); g.length && html_contents.node.isBlock(g[0]);) h = g[0], g = html_contents.node.contents(h);
					jq(c).replaceWith(jq.FroalaEditor.MARKERS), jq(e).append(h.innerHTML), jq(h).remove()
				} else {
					for (jq(c).replaceWith(jq.FroalaEditor.MARKERS); h && "BR" !== h.tagName && !html_contents.node.isBlock(h);) {
						var j = h;
						h = h.nextSibling, jq(e).append(j)
					}
					h && "BR" == h.tagName && jq(h).remove()
				}
			}
		}
		function l(d) {
			for (var e = d; !e.nextSibling;) e = e.parentNode;
			if (e = e.nextSibling, "BR" == e.tagName) if (e.nextSibling) {
				if (html_contents.node.isBlock(e.nextSibling)) {
					if (!(jq.FroalaEditor.NO_DELETE_TAGS.indexOf(e.nextSibling.tagName) < 0)) return;
					e = e.nextSibling, jq(e.previousSibling).remove()
				}
			} else if (isAtEndSimple(e)) {
				if (g(d)) html_contents.cursorLists._del(d);
				else {
					var f = html_contents.node.deepestParent(e);
					f && (jq(e).remove(), k(d))
				}
				return
			}
			var h;
			if (html_contents.node.isBlock(e)) {
				if (jq.FroalaEditor.NO_DELETE_TAGS.indexOf(e.tagName) < 0) if (html_contents.node.isList(e)) d.previousSibling ? (jq(e).find("li:first").prepend(d), html_contents.cursorLists._backspace(d)) : (jq(e).find("li:first").prepend(jq.FroalaEditor.MARKERS), jq(d).remove());
				else if (h = html_contents.node.contents(e), h && "BR" == h[0].tagName && jq(h[0]).remove(), h && "BLOCKQUOTE" == e.tagName) {
					var i = h[0];
					for (jq(d).before(jq.FroalaEditor.MARKERS); i && "BR" != i.tagName;) {
						var j = i;
						i = i.nextSibling, jq(d).before(j)
					}
					i && "BR" == i.tagName && jq(i).remove()
				} else jq(d).after(jq(e).html()).after(jq.FroalaEditor.MARKERS), jq(e).remove()
			} else {
				for (h = html_contents.node.contents(e); e.nodeType != Node.TEXT_NODE && h.length && !jq(e).is("[contenteditable='false']");) e = h[0], h = html_contents.node.contents(e);
				e.nodeType == Node.TEXT_NODE ? (jq(e).before(jq.FroalaEditor.MARKERS), e.textContent.length && 55357 == e.textContent.charCodeAt(0) ? e.textContent = e.textContent.substring(2, e.textContent.length) : e.textContent = e.textContent.substring(1, e.textContent.length)) : html_contents.events.trigger("node.remove", [jq(e)]) !== false && (jq(e).before(jq.FroalaEditor.MARKERS), jq(e).remove()), jq(d).remove()
			}
		}
		function del() {
			var e = html_contents.markers.insert();
			
			if (html_contents.$el.get(0).normalize(), isAtEndSimple(e)) if (g(e)) if (0 === jq(e).parents("li:first").find("ul, ol").length) html_contents.cursorLists._del(e);
			else {
				var f = jq(e).parents("li:first").find("ul:first, ol:first").find("li:first");
				f = f.find(html_contents.html.blockTagsQuery()).get(-1) || f, f.prepend(e), html_contents.cursorLists._backspace(e)
			} else k(e);
			else l(isAtStartSimple(e) ? e : e);
			jq(e).remove(), html_contents.$el.find("blockquote:empty").remove(), html_contents.html.fillEmptyBlocks(true), html_contents.html.cleanEmptyTags(true), html_contents.clean.quotes(), html_contents.clean.lists(), html_contents.html.normalizeSpaces(), html_contents.selection.restore()
		}
		function findFrToRemove() {
			html_contents.$el.find(".fr-to-remove").each(function() {
				for (var c = html_contents.node.contents(this), d = 0; d < c.length; d++) c[d].nodeType == Node.TEXT_NODE && (c[d].textContent = c[d].textContent.replace(/\u200B/g, ""));
				jq(this).replaceWith(this.innerHTML);
			})
		}
		function o(c, d, e) {
			var g, h = html_contents.node.deepestParent(c, [], !e);
			if (h && "BLOCKQUOTE" == h.tagName) return isAtEnd(c, h) ? (g = html_contents.html.defaultTag(), g ? jq(h).after("<" + g + ">" + jq.FroalaEditor.MARKERS + "<br></" + g + ">") : jq(h).after(jq.FroalaEditor.MARKERS + "<br>"), jq(c).remove(), false) : (q(c, d, e), false);
			if (null == h) jq(c).replaceWith("<br/>" + jq.FroalaEditor.MARKERS + "<br/>");
			else {
				var i = c,
					j = "";
				(!html_contents.node.isBlock(h) || d) && (j = "<br/>");
				var k = "",
					l = "";
				g = html_contents.html.defaultTag();
				
				var m = "",
					n = "";
				g && html_contents.node.isBlock(h) && (m = "<" + g + ">", n = "</" + g + ">");
				do
				if (i = i.parentNode, !d || i != h || d && !html_contents.node.isBlock(h)) if (k += html_contents.node.closeTagString(i), i == h && html_contents.node.isBlock(h)) l = m + l;
				else {
					var o = "A" == i.tagName && isAtEnd(c, i) ? "fr-to-remove" : "";
					l = html_contents.node.openTagString(jq(i).clone().addClass(o).get(0)) + l
				}
				while (i != h);
				j = k + j + l + (c.parentNode == h && html_contents.node.isBlock(h) ? "" : jq.FroalaEditor.INVISIBLE_SPACE) + jq.FroalaEditor.MARKERS, html_contents.node.isBlock(h) && jq(h).append("<br/>"), jq(c).after('<span id="fr-break"></span>'), jq(c).remove(), h.nextSibling && !html_contents.node.isBlock(h.nextSibling) || html_contents.node.isBlock(h) || jq(h).after("<br>");
				var p;
				p = !d && html_contents.node.isBlock(h) ? html_contents.node.openTagString(h) + jq(h).html() + n : html_contents.node.openTagString(h) + jq(h).html() + html_contents.node.closeTagString(h), p = p.replace(/<span id="fr-break"><\/span>/g, j), jq(h).replaceWith(p)
			}
		}
		function p(c, d, g) {
			var h = html_contents.node.deepestParent(c, [], !g);
			if (h && "BLOCKQUOTE" == h.tagName) {
				if (isAtStart(c, h)) {
					var i = html_contents.html.defaultTag();
					
					return i ? jq(h).before("<" + i + ">" + jq.FroalaEditor.MARKERS + "<br></" + i + ">") : jq(h).before(jq.FroalaEditor.MARKERS + "<br>"), jq(c).remove(), false
				}
				isAtEnd(c, h) ? o(c, d, true) : q(c, d, true)
			}
			null == h ? jq(c).replaceWith("<br>" + jq.FroalaEditor.MARKERS) : (html_contents.node.isBlock(h) ? d ? (jq(c).remove(), jq(h).prepend("<br>" + jq.FroalaEditor.MARKERS)) : jq(h).before(html_contents.node.openTagString(h) + "<br>" + html_contents.node.closeTagString(h)) : jq(h).before("<br>"), jq(c).remove())
		}
		function q(c, d, g) {
			var h = html_contents.node.deepestParent(c, [], !g);
			if (null == h)(!c.nextSibling || html_contents.node.isBlock(c.nextSibling)) && jq(c).after("<br>"), jq(c).replaceWith("<br>" + jq.FroalaEditor.MARKERS);
			else {
				var i = c,
					j = "";
				"PRE" == h.tagName && (d = true), (!html_contents.node.isBlock(h) || d) && (j = "<br>");
				var k = "",
					l = "";
				do {
					var m = i;
					if (i = i.parentNode, "BLOCKQUOTE" == h.tagName && html_contents.node.isEmpty(m) && !jq(m).hasClass("fr-marker") && jq(m).find(c).length > 0 && jq(m).after(c), ("BLOCKQUOTE" != h.tagName || !isAtEnd(c, i) && !isAtStart(c, i)) && (!d || i != h || d && !html_contents.node.isBlock(h))) {
						k += html_contents.node.closeTagString(i);
						var n = "A" == i.tagName && isAtEnd(c, i) ? "fr-to-remove" : "";
						l = html_contents.node.openTagString(jq(i).clone().addClass(n).get(0)) + l
					}
				} while 
				(i != h);
				var o = h == c.parentNode && html_contents.node.isBlock(h) || c.nextSibling;
				if ("BLOCKQUOTE" == h.tagName) {
					c.previousSibling && html_contents.node.isBlock(c.previousSibling) && c.nextSibling && "BR" == c.nextSibling.tagName && (jq(c.nextSibling).after(c), c.nextSibling && "BR" == c.nextSibling.tagName && jq(c.nextSibling).remove());
					var p = html_contents.html.defaultTag();
					
					j = k + j + (p ? "<" + p + ">" : "") + jq.FroalaEditor.MARKERS + "<br>" + (p ? "</" + p + ">" : "") + l
				} else j = k + j + l + (o ? "" : jq.FroalaEditor.INVISIBLE_SPACE) + jq.FroalaEditor.MARKERS;
				jq(c).replaceWith('<span id="fr-break"></span>');
				var q = html_contents.node.openTagString(h) + jq(h).html() + html_contents.node.closeTagString(h);
				q = q.replace(/<span id="fr-break"><\/span>/g, j), jq(h).replaceWith(q)
			}
		}
		function enter(boolVal) {
			var f = html_contents.markers.insert();
			
			html_contents.$el.get(0).normalize();
			
			var h = false;
			jq(f).parentsUntil(html_contents.$el, "BLOCKQUOTE").length > 0 && (boolVal = false, h = true);
			
			jq(f).parentsUntil(html_contents.$el, "TD, TH").length && (h = false);
			
			if (isAtEndSimple(f)) { 
				if (!g(f) || boolVal || h) {
					o(f, boolVal, h)
				} else {
					html_contents.cursorLists._endEnter(f)
				}
			} else { 
				if (isAtStartSimple(f)) {
					if (!g(f) || boolVal || h) {
						p(f, boolVal, h)
					} else {
						html_contents.cursorLists._startEnter(f)		
					}
				} else {
					if (!g(f) || boolVal || h) {
						q(f, boolVal, h)
					} else {
						html_contents.cursorLists._middleEnter(f);
					}
				}
			}
			
			findFrToRemove(), 
			
			html_contents.html.fillEmptyBlocks(true), 
			
			html_contents.html.cleanEmptyTags(true), 
			
			html_contents.clean.lists(), 
			
			html_contents.html.normalizeSpaces(), 
			
			html_contents.selection.restore()
		}
		return {
			require: ["node", "html", "cursorLists", "selection"],
			enter: enter,
			backspace: backspace,
			del: del,
			isAtEnd: isAtEnd
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.cursorLists = function(b) {
		function c(a) {
			for (var b = a;
			"LI" != b.tagName;) b = b.parentNode;
			return b
		}
		function d(a) {
			for (var c = a; !b.node.isList(c);) c = c.parentNode;
			return c
		}
		function _startEnter(e) {
			var f, g = c(e),
				h = g.nextSibling,
				i = g.previousSibling,
				j = b.html.defaultTag();
			
			if (b.node.isEmpty(g, true) && h) {
				for (var k = "", l = "", m = e.parentNode; !b.node.isList(m) && m.parentNode && "LI" !== m.parentNode.tagName;) k = b.node.openTagString(m) + k, l += b.node.closeTagString(m), m = m.parentNode;
				k = b.node.openTagString(m) + k, l += b.node.closeTagString(m);
				var n = "";
				for (n = m.parentNode && "LI" == m.parentNode.tagName ? l + "<li>" + jq.FroalaEditor.MARKERS + "<br>" + k : j ? l + "<" + j + ">" + jq.FroalaEditor.MARKERS + "<br></" + j + ">" + k : l + jq.FroalaEditor.MARKERS + "<br>" + k, jq(g).html('<span id="fr-break"></span>');
				["UL", "OL"].indexOf(m.tagName) < 0 || m.parentNode && "LI" === m.parentNode.tagName;) m = m.parentNode;
				var o = b.node.openTagString(m) + jq(m).html() + b.node.closeTagString(m);
				o = o.replace(/<span id="fr-break"><\/span>/g, n), jq(m).replaceWith(o), b.$el.find("li:empty").remove()
			} else i && h || !b.node.isEmpty(g, true) ? (jq(g).before("<li><br></li>"), jq(e).remove()) : i ? (f = d(g), f.parentNode && "LI" == f.parentNode.tagName ? jq(f.parentNode).after("<li>" + jq.FroalaEditor.MARKERS + "<br></li>") : j ? jq(f).after("<" + j + ">" + jq.FroalaEditor.MARKERS + "<br></" + j + ">") : jq(f).after(jq.FroalaEditor.MARKERS + "<br>"), jq(g).remove()) : (f = d(g), f.parentNode && "LI" == f.parentNode.tagName ? jq(f.parentNode).before("<li>" + jq.FroalaEditor.MARKERS + "<br></li>") : j ? jq(f).before("<" + j + ">" + jq.FroalaEditor.MARKERS + "<br></" + j + ">") : jq(f).before(jq.FroalaEditor.MARKERS + "<br>"), jq(g).remove())
		}
		function _middleEnter(d) {
			for (var e = c(d), f = "", g = d, h = "", i = ""; g != e;) {
				g = g.parentNode;
				var j = "A" == g.tagName && b.cursor.isAtEnd(d, g) ? "fr-to-remove" : "";
				h = b.node.openTagString(jq(g).clone().addClass(j).get(0)) + h, i = b.node.closeTagString(g) + i
			}
			f = i + f + h + jq.FroalaEditor.MARKERS, jq(d).replaceWith('<span id="fr-break"></span>');
			var k = b.node.openTagString(e) + jq(e).html() + b.node.closeTagString(e);
			k = k.replace(/<span id="fr-break"><\/span>/g, f), jq(e).replaceWith(k)
		}
		function _endEnter(d) {
			for (var e = c(d), f = jq.FroalaEditor.MARKERS, g = d; g != e;) {
				g = g.parentNode;
				var h = "A" == g.tagName && b.cursor.isAtEnd(d, g) ? "fr-to-remove" : "";
				f = b.node.openTagString(jq(g).clone().addClass(h).get(0)) + f + b.node.closeTagString(g)
			}
			jq(d).remove(), jq(e).after(f)
		}
		function _backspace(e) {
			var f = c(e),
				g = f.previousSibling;
			if (g) {
				g = jq(g).find(b.html.blockTagsQuery()).get(-1) || g, jq(e).replaceWith(jq.FroalaEditor.MARKERS);
				var h = b.node.contents(g);
				h.length && "BR" == h[h.length - 1].tagName && jq(h[h.length - 1]).remove(), jq(f).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function() {
					this.parentNode == f && jq(this).replaceWith(jq(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
				});
				
				for (var i, j = b.node.contents(f)[0]; j && !b.node.isList(j);) i = j.nextSibling, jq(g).append(j), j = i;
				for (g = f.previousSibling; j;) i = j.nextSibling, jq(g).append(j), j = i;
				jq(f).remove()
			} else {
				var k = d(f);
				if (jq(e).replaceWith(jq.FroalaEditor.MARKERS), k.parentNode && "LI" == k.parentNode.tagName) {
					var l = k.previousSibling;
					b.node.isBlock(l) ? (jq(f).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function() {
						this.parentNode == f && jq(this).replaceWith(jq(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
					}), jq(l).append(jq(f).html())) : jq(k).before(jq(f).html())
				} else {
					var m = b.html.defaultTag();
					
					m && 0 === jq(f).find(b.html.blockTagsQuery()).length ? jq(k).before("<" + m + ">" + jq(f).html() + "</" + m + ">") : jq(k).before(jq(f).html())
				}
				jq(f).remove(), 0 === jq(k).find("li").length && jq(k).remove()
			}
		}
		function _del(d) {
			var e, f = c(d),
				g = f.nextSibling;
			if (g) {
				e = b.node.contents(g), e.length && "BR" == e[0].tagName && jq(e[0]).remove(), jq(g).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function() {
					this.parentNode == g && jq(this).replaceWith(jq(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
				});
				
				for (var h, i = d, j = b.node.contents(g)[0]; j && !b.node.isList(j);) h = j.nextSibling, jq(i).after(j), i = j, j = h;
				for (; j;) h = j.nextSibling, jq(f).append(j), j = h;
				jq(d).replaceWith(jq.FroalaEditor.MARKERS), jq(g).remove()
			} else {
				for (var k = f; !k.nextSibling && k != b.$el.get(0);) k = k.parentNode;
				if (k == b.$el.get(0)) return false;
				if (k = k.nextSibling, b.node.isBlock(k)) jq.FroalaEditor.NO_DELETE_TAGS.indexOf(k.tagName) < 0 && (jq(d).replaceWith(jq.FroalaEditor.MARKERS), e = b.node.contents(f), e.length && "BR" == e[e.length - 1].tagName && jq(e[e.length - 1]).remove(), jq(f).append(jq(k).html()), jq(k).remove());
				else
				for (e = b.node.contents(f), e.length && "BR" == e[e.length - 1].tagName && jq(e[e.length - 1]).remove(), jq(d).replaceWith(jq.FroalaEditor.MARKERS); k && !b.node.isBlock(k) && "BR" != k.tagName;) jq(f).append(jq(k)), k = k.nextSibling
			}
		}
		return {
			_startEnter: _startEnter,
			_middleEnter: _middleEnter,
			_endEnter: _endEnter,
			_backspace: _backspace,
			_del: _del
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.INVISIBLE_SPACE = "&#8203;", jq.FroalaEditor.START_MARKER = '<span class="fr-marker" data-id="0" data-type="true" style="display: none; line-height: 0;">' + jq.FroalaEditor.INVISIBLE_SPACE + "</span>", jq.FroalaEditor.END_MARKER = '<span class="fr-marker" data-id="0" data-type="false" style="display: none; line-height: 0;">' + jq.FroalaEditor.INVISIBLE_SPACE + "</span>", jq.FroalaEditor.MARKERS = jq.FroalaEditor.START_MARKER + jq.FroalaEditor.END_MARKER, jq.FroalaEditor.MODULES.markers = function(b) {
		function c(c, d) {
			return jq('<span class="fr-marker" data-id="' + d + '" data-type="' + c + '" style="display: none; line-height: 0;">' + jq.FroalaEditor.INVISIBLE_SPACE + "</span>", b.document)[0]
		}
		function d(d, e, f) {
			try {
				var g = d.cloneRange();
				
				if (g.collapse(e), g.insertNode(c(e, f)), e === true && d.collapsed) for (var h = b.$el.find('span.fr-marker[data-type="true"][data-id="' + f + '"]').get(0).nextSibling; h && h.nodeType === Node.TEXT_NODE && 0 === h.textContent.length;) jq(h).remove(), h = b.$el.find('span.fr-marker[data-type="true"][data-id="' + f + '"]').get(0).nextSibling;
				if (e === true && !d.collapsed) {
					var e = b.$el.find('span.fr-marker[data-type="true"][data-id="' + f + '"]').get(0),
						h = e.nextSibling;
					if (h && h.nodeType === Node.ELEMENT_NODE && b.node.isBlock(h)) {
						var i = [h];
						do h = i[0], i = b.node.contents(h);
						while (i[0] && b.node.isBlock(i[0]));
						jq(h).prepend(jq(e))
					}
				}
				if (e === false && !d.collapsed) {
					var e = b.$el.find('span.fr-marker[data-type="false"][data-id="' + f + '"]').get(0),
						h = e.previousSibling;
					if (h && h.nodeType === Node.ELEMENT_NODE && b.node.isBlock(h)) {
						var i = [h];
						do h = i[i.length - 1], i = b.node.contents(h);
						while (i[i.length - 1] && b.node.isBlock(i[i.length - 1]));
						jq(h).append(jq(e))
					}
					e.parentNode && ["TD", "TH"].indexOf(e.parentNode.tagName) >= 0 && e.parentNode.previousSibling && !e.previousSibling && jq(e.parentNode.previousSibling).append(e)
				}
			} catch (j) {}
		}
		function e() {
			if (!b.$wp) return false;
			try {
				var c = b.selection.ranges(0).cloneRange();
				
				c.collapse(true);
				var d = jq('<span class="fr-marker" style="display: inline; line-height: 0;">' + jq.FroalaEditor.INVISIBLE_SPACE + "</span>", b.document)[0];
				c.insertNode(d), d = b.$el.find("span.fr-marker").get(0);
				for (var e = d.nextSibling; e && e.nodeType === Node.TEXT_NODE && 0 === e.textContent.length;) jq(e).remove(), e = b.$el.find("span.fr-marker").get(0).nextSibling;
				return d
			} catch (f) {
				console.log("MARKER", f)
			}
		}
		function f(a) {
			var c = a.clientX,
				d = a.clientY;
			g();
			
			var f, h = null;
			if ("undefined" != typeof b.document.caretPositionFromPoint ? (f = b.document.caretPositionFromPoint(c, d), h = b.document.createRange(), h.setStart(f.offsetNode, f.offset), h.setEnd(f.offsetNode, f.offset)) : "undefined" != typeof b.document.caretRangeFromPoint && (f = b.document.caretRangeFromPoint(c, d), h = b.document.createRange(), h.setStart(f.startContainer, f.startOffset), h.setEnd(f.startContainer, f.startOffset)), null !== h && "undefined" != typeof b.window.getSelection) {
				var i = b.window.getSelection();
				
				i.removeAllRanges(), i.addRange(h)
			} else if ("undefined" != typeof b.document.body.createTextRange) try {
				h = b.document.body.createTextRange(), h.moveToPoint(c, d);
				var j = h.duplicate();
				
				j.moveToPoint(c, d), h.setEndPoint("EndToEnd", j), h.select()
			} catch (k) {}
			e()
		}
		function g() {
			b.$el.find(".fr-marker").remove()
		}
		return {
			place: d,
			insert: e,
			insertAtPoint: f,
			remove: g
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.node = function(b) {
		function contents(b) {
			return b && "IFRAME" != b.tagName ? jq(b).contents() : []
		}
		function isBlock(input) {
			return input ? input.nodeType != Node.ELEMENT_NODE ? false : jq.FroalaEditor.BLOCK_TAGS.indexOf(input.tagName.toLowerCase()) >= 0 : false
		}
		function isEmpty(b, e) {
			if (jq(b).find("table").length > 0) return false;
			var f = contents(b);
			1 == f.length && isBlock(f[0]) && (f = contents(f[0]));
			for (var g = false, h = 0; h < f.length; h++) {
				var i = f[h];
				if (!e || !jq(i).hasClass("fr-marker")) {
					if (!("BR" == i.tagName || i.textContent && 0 == i.textContent.replace(/\u200B/gi, "").length) || 1 == g) return false;
					"BR" == i.tagName && (g = true)
				}
			}
			return true
		}
		function blockParent(c) {
			for (; c && c.parentNode !== b.$el.get(0) && (!c.parentNode || !jq(c.parentNode).hasClass("fr-inner"));) if (c = c.parentNode, isBlock(c)) return c;
			return null
		}
		function deepestParent(c, e, f) {
			if ("undefined" == typeof e && (e = []), "undefined" == typeof f && (f = true), e.push(b.$el.get(0)), e.indexOf(c.parentNode) >= 0 || c.parentNode && jq(c.parentNode).hasClass("fr-inner") || c.parentNode && jq.FroalaEditor.SIMPLE_ENTER_TAGS.indexOf(c.parentNode.tagName) >= 0 && f) return null;
			for (; e.indexOf(c.parentNode) < 0 && c.parentNode && !jq(c.parentNode).hasClass("fr-inner") && (jq.FroalaEditor.SIMPLE_ENTER_TAGS.indexOf(c.parentNode.tagName) < 0 || !f) && (!isBlock(c) || !isBlock(c.parentNode) || !f);) c = c.parentNode;
			return c
		}
		function rawAttributes(a) {
			for (var b = {}, c = a.attributes, d = 0; d < c.length; d++) {
				var e = c[d];
				b[e.nodeName] = e.value
			}
			return b
		}
		function attributes(a) {
			for (var b = "", c = a.attributes, d = 0; d < c.length; d++) {
				var e = c[d];
				b += " " + e.nodeName + '="' + e.value + '"'
			}
			return b
		}
		function clearAttributes(a) {
			for (var b = a.attributes, c = 0; c < b.length; c++) {
				var d = b[c];
				a.removeAttribute(d.nodeName)
			}
		}
		function openTagString(a) {
			return "<" + a.tagName.toLowerCase() + attributes(a) + ">"
		}
		function closeTagString(a) {
			return "</" + a.tagName.toLowerCase() + ">"
		}
		function isFirstSibling(b, c) {
			"undefined" == typeof c && (c = true);
			for (var d = b.previousSibling; d && c && jq(d).hasClass("fr-marker");) d = d.previousSibling;
			return d ? d.nodeType == Node.TEXT_NODE && "" === d.textContent ? isFirstSibling(d) : false : true
		}
		function isVoid(b) {
			return b && jq.FroalaEditor.VOID_ELEMENTS.indexOf((b.tagName || "").toLowerCase()) >= 0
		}
		function isList(a) {
			return a ? ["UL", "OL"].indexOf(a.tagName) >= 0 : false
		}
		function isElement(a) {
			return a === b.$el.get(0)
		}
		function hasFocus(a) {
			return a == b.document.activeElement
		}
		return {
			isBlock: isBlock,
			isEmpty: isEmpty,
			blockParent: blockParent,
			deepestParent: deepestParent,
			rawAttributes: rawAttributes,
			attributes: attributes,
			clearAttributes: clearAttributes,
			openTagString: openTagString,
			closeTagString: closeTagString,
			isFirstSibling: isFirstSibling,
			isList: isList,
			isElement: isElement,
			contents: contents,
			isVoid: isVoid,
			hasFocus: hasFocus
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.selection = function(b) {
		function c() {
			var a = "";
			return b.window.getSelection ? a = b.window.getSelection() : b.document.getSelection ? a = b.document.getSelection() : b.document.selection && (a = b.document.selection.createRange().text), a.toString()
		}
		function d() {
			var a = "";
			return a = b.window.getSelection ? b.window.getSelection() : b.document.getSelection ? b.document.getSelection() : b.document.selection.createRange()
		}
		function e(a) {
			var c = d(),
				e = [];
			if (c && c.getRangeAt && c.rangeCount) for (var e = [], f = 0; f < c.rangeCount; f++) e.push(c.getRangeAt(f));
			else e = b.document.createRange ? [b.document.createRange()] : [];
			return "undefined" != typeof a ? e[a] : e
		}
		function f() {
			var a = d();
			
			try {
				a.removeAllRanges ? a.removeAllRanges() : a.empty ? a.empty() : a.clear && a.clear()
			} catch (b) {}
		}
		function g() {
			var f = d();
			
			if (f.rangeCount) {
				var g = e(0),
					h = g.startContainer;
				if (h.nodeType == Node.ELEMENT_NODE) {
					var i = false;
					if (h.childNodes.length > 0 && h.childNodes[g.startOffset]) {
						for (var j = h.childNodes[g.startOffset]; j && j.nodeType == Node.TEXT_NODE && 0 == j.textContent.length;) j = j.nextSibling;
						j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = true)
					} else if (!g.collapsed && h.nextSibling && h.nextSibling.nodeType == Node.ELEMENT_NODE) {
						var j = h.nextSibling;
						j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = true)
					}!i && h.childNodes.length > 0 && jq(h.childNodes[0]).text().replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && ["BR", "IMG", "HR"].indexOf(h.childNodes[0].tagName) < 0 && (h = h.childNodes[0])
				}
				for (; h.nodeType != Node.ELEMENT_NODE && h.parentNode;) h = h.parentNode;
				for (var k = h; k && "HTML" != k.tagName;) {
					if (k == b.$el.get(0)) return h;
					k = jq(k).parent()[0]
				}
			}
			return b.$el.get(0)
		}
		function h() {
			var f = d();
			
			if (f.rangeCount) {
				var g = e(0),
					h = g.endContainer;
				if (h.nodeType == Node.ELEMENT_NODE) {
					var i = false;
					if (h.childNodes.length > 0 && h.childNodes[g.endOffset] && jq(h.childNodes[g.endOffset]).text() === c()) h = h.childNodes[g.endOffset], i = true;
					else if (!g.collapsed && h.previousSibling && h.previousSibling.nodeType == Node.ELEMENT_NODE) {
						var j = h.previousSibling;
						j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = true)
					}!i && h.childNodes.length > 0 && jq(h.childNodes[h.childNodes.length - 1]).text() === c() && ["BR", "IMG", "HR"].indexOf(h.childNodes[h.childNodes.length - 1].tagName) < 0 && (h = h.childNodes[h.childNodes.length - 1])
				}
				for (h.nodeType == Node.TEXT_NODE && 0 == g.endOffset && h.previousSibling && h.previousSibling.nodeType == Node.ELEMENT_NODE && (h = h.previousSibling); h.nodeType != Node.ELEMENT_NODE && h.parentNode;) h = h.parentNode;
				for (var k = h; k && "HTML" != k.tagName;) {
					if (k == b.$el.get(0)) return h;
					k = jq(k).parent()[0]
				}
			}
			return b.$el.get(0)
		}
		function i(a, b) {
			var c = a;
			return 1 == c.nodeType && c.childNodes.length > 0 && c.childNodes[b] && (c = c.childNodes[b]), c.nodeType == Node.TEXT_NODE && (c = c.parentNode), c
		}
		function j() {
			var c = [],
				f = d();
			
			if (t() && f.rangeCount) for (var g = e(), h = 0; h < g.length; h++) {
				var j = g[h],
					k = i(j.startContainer, j.startOffset),
					l = i(j.endContainer, j.endOffset);
				b.node.isBlock(k) && c.indexOf(k) < 0 && c.push(k);
				var m = b.node.blockParent(k);
				m && c.indexOf(m) < 0 && c.push(m);
				for (var n = [], o = k; o !== l && o !== b.$el.get(0);) n.indexOf(o) < 0 && o.children && o.children.length ? (n.push(o), o = o.children[0]) : o.nextSibling ? o = o.nextSibling : o.parentNode && (o = o.parentNode, n.push(o)), b.node.isBlock(o) && n.indexOf(o) < 0 && c.indexOf(o) < 0 && c.push(o);
				b.node.isBlock(l) && c.indexOf(l) < 0 && c.push(l);
				var m = b.node.blockParent(l);
				m && c.indexOf(m) < 0 && c.push(m)
			}
			for (var h = c.length - 1; h > 0; h--) jq(c[h]).find(c).length && "LI" != c[h].tagName && c.splice(h, 1);
			return c
		}
		function k() {
			if (b.$wp) {
				b.markers.remove();
				
				for (var a = e(), c = 0; c < a.length; c++) if (a[c].startContainer !== b.document) {
					var d = a[c];
					b.markers.place(d, true, c), b.markers.place(d, false, c)
				}
			}
		}
		function l() {
			var c = b.$el.find('.fr-marker[data-type="true"]');
			if (!b.$wp) return c.remove(), false;
			if (0 === c.length) return false;
			var e = jq(b.original_window).scrollTop();
			
			b.core.hasFocus() && b.browser.msie || b.$el.focus(), f();
			
			for (var g = d(), h = 0; h < c.length; h++) {
				var i = jq(c[h]).data("id"),
					j = c[h],
					k = b.document.createRange(),
					l = b.$el.find('.fr-marker[data-type="false"][data-id="' + i + '"]');
				if (l.length > 0) {
					l = l[0];
					try {
						for (var n = false, o = j.nextSibling; o && o.nodeType == Node.TEXT_NODE && 0 == o.textContent.length;) {
							var p = o;
							o = o.nextSibling, jq(p).remove()
						}
						for (var q = l.nextSibling; q && q.nodeType == Node.TEXT_NODE && 0 == q.textContent.length;) {
							var p = q;
							q = q.nextSibling, jq(p).remove()
						}
						if (j.nextSibling == l || l.nextSibling == j) {
							for (var r = j.nextSibling == l ? j : l, s = r == j ? l : j, t = r.previousSibling; t && t.nodeType == Node.TEXT_NODE && 0 == t.length;) {
								var p = t;
								t = t.previousSibling, jq(p).remove()
							}
							if (t && t.nodeType == Node.TEXT_NODE) for (; t && t.previousSibling && t.previousSibling.nodeType == Node.TEXT_NODE;) t.previousSibling.textContent = t.previousSibling.textContent + t.textContent, t = t.previousSibling, jq(t.nextSibling).remove();
							
							for (var u = s.nextSibling; u && u.nodeType == Node.TEXT_NODE && 0 == u.length;) {
								var p = u;
								u = u.nextSibling, jq(p).remove()
							}
							if (u && u.nodeType == Node.TEXT_NODE) for (; u && u.nextSibling && u.nextSibling.nodeType == Node.TEXT_NODE;) u.nextSibling.textContent = u.textContent + u.nextSibling.textContent, u = u.nextSibling, jq(u.previousSibling).remove();
							
							if (t && b.node.isVoid(t) && (t = null), u && b.node.isVoid(u) && (u = null), t && u && t.nodeType == Node.TEXT_NODE && u.nodeType == Node.TEXT_NODE) {
								jq(j).remove(), jq(l).remove();
								
								var v = t.textContent.length;
								t.textContent = t.textContent + u.textContent, jq(u).remove(), b.html.normalizeSpaces(t), k.setStart(t, v), k.setEnd(t, v), n = true
							} else!t && u && u.nodeType == Node.TEXT_NODE ? (jq(j).remove(), jq(l).remove(), b.html.normalizeSpaces(u), k.setStart(u, 0), k.setEnd(u, 0), n = true) : !u && t && t.nodeType == Node.TEXT_NODE && (jq(j).remove(), jq(l).remove(), b.html.normalizeSpaces(t), k.setStart(t, t.textContent.length), k.setEnd(t, t.textContent.length), n = true)
						}
						if (!n) {
							var w, x;
							b.browser.chrome && j.nextSibling == l ? (w = m(l, k, true) || k.setStartAfter(l), x = m(j, k, false) || k.setEndBefore(j)) : (w = m(j, k, true) || k.setStartBefore(j), x = m(l, k, false) || k.setEndAfter(l)), "function" == typeof w && w(), "function" == typeof x && x()
						}
					} catch (y) {
						console.log("RESTORE RANGE", y)
					}
				}
				g.addRange(k)
			}
			b.markers.remove(), jq(b.original_window).scrollTop(e)
		}
		function m(c, d, e) {
			var f = c.previousSibling,
				g = c.nextSibling;
			if (f && g && f.nodeType == Node.TEXT_NODE && g.nodeType == Node.TEXT_NODE) {
				var h = f.textContent.length;
				return e ? (g.textContent = f.textContent + g.textContent, jq(f).remove(), jq(c).remove(), b.html.normalizeSpaces(g), function() {
					d.setStart(g, h)
				}) : (f.textContent = f.textContent + g.textContent, jq(g).remove(), jq(c).remove(), b.html.normalizeSpaces(f), function() {
					d.setEnd(f, h)
				})
			}
			return false
		}
		function n() {
			return true
		}
		function o() {
			for (var a = e(), b = 0; b < a.length; b++) if (!a[b].collapsed) return false;
			return true
		}
		function p(a) {
			var c, d, e = false,
				f = false;
			if (b.window.getSelection) {
				var g = b.window.getSelection();
				
				g.rangeCount && (c = g.getRangeAt(0), d = c.cloneRange(), d.selectNodeContents(a), d.setEnd(c.startContainer, c.startOffset), e = "" === d.toString(), d.selectNodeContents(a), d.setStart(c.endContainer, c.endOffset), f = "" === d.toString())
			} else b.document.selection && "Control" != b.document.selection.type && (c = b.document.selection.createRange(), d = c.duplicate(), d.moveToElementText(a), d.setEndPoint("EndToStart", c), e = "" === d.text, d.moveToElementText(a), d.setEndPoint("StartToEnd", c), f = "" === d.text);
			return {
				atStart: e,
				atEnd: f
			}
		}
		function q() {
			if (o()) return false;
			b.$el.find("td").prepend('<span class="fr-mk">' + jq.FroalaEditor.INVISIBLE_SPACE + "</span>"), b.$el.find("img").before('<span class="fr-mk">' + jq.FroalaEditor.INVISIBLE_SPACE + "</span>");
			var c = false,
				d = p(b.$el.get(0));
			return d.atStart && d.atEnd && (c = true), b.$el.find(".fr-mk").remove(), c
		}
		function r(c, d) {
			"undefined" == typeof d && (d = true);
			var e = jq(c).html();
			
			e && e.replace(/\u200b/g, "").length != e.length && jq(c).html(e.replace(/\u200b/g, ""));
			for (var f = b.node.contents(c), g = 0; g < f.length; g++) f[g].nodeType != Node.ELEMENT_NODE ? jq(f[g]).remove() : (r(f[g], 0 == g), 0 == g && (d = false));
			c.nodeType == Node.TEXT_NODE ? jq(c).replaceWith('<span data-first="true" data-text="true"></span>') : d && jq(c).attr("data-first", true)
		}
		function s(c, d) {
			var e = b.node.contents(c.get(0));
			["TD", "TH"].indexOf(c.get(0).tagName) >= 0 && 1 == c.find(".fr-marker").length && jq(e[0]).hasClass("fr-marker") && c.attr("data-del-cell", true);
			for (var f = 0; f < e.length; f++) {
				var g = e[f];
				jq(g).hasClass("fr-marker") ? d = (d + 1) % 2 : d ? jq(g).find(".fr-marker").length > 0 ? d = s(jq(g), d) : ["TD", "TH"].indexOf(g.tagName) < 0 && !jq(g).hasClass("fr-inner") ? !b.opts.keepFormatOnDelete || d > 1 || b.$el.find("[data-first]").length > 0 ? jq(g).remove() : r(g) : jq(g).hasClass("fr-inner") ? 0 == jq(g).find(".fr-inner").length ? jq(g).html("<br>") : jq(g).find(".fr-inner").filter(function() {
					return 0 == jq(this).find("fr-inner").length
				}).html("<br>") : (jq(g).empty(), jq(g).attr("data-del-cell", true)) : jq(g).find(".fr-marker").length > 0 && (d = s(jq(g), d))
			}
			return d
		}
		function t() {
			if (!b.$wp) return false;
			for (var a = e(0), c = a.commonAncestorContainer; c && !b.node.isElement(c);) c = c.parentNode;
			return b.node.isElement(c) ? true : false
		}
		function u() {
			k();
			
			for (var c = function(b) {
				for (var c = b.previousSibling; c && c.nodeType == Node.TEXT_NODE && 0 == c.textContent.length;) {
					var d = c,
						c = c.previousSibling;
					jq(d).remove()
				}
				return c
			}, 
			d = function(b) {
				for (var c = b.nextSibling; c && c.nodeType == Node.TEXT_NODE && 0 == c.textContent.length;) {
					var d = c,
						c = c.nextSibling;
					jq(d).remove()
				}
				return c
			}, 
			e = b.$el.find('.fr-marker[data-type="true"]'), f = 0; f < e.length; f++) for (var g = e[f]; !c(g) && !b.node.isBlock(g.parentNode);) jq(g.parentNode).before(g);
			for (var h = b.$el.find('.fr-marker[data-type="false"]'), f = 0; f < h.length; f++) for (var i = h[f]; !d(i) && !b.node.isBlock(i.parentNode);) jq(i.parentNode).after(i);
			if (n()) {
				s(b.$el, 0);
				var j = b.$el.find('[data-first="true"]');
				if (j.length) b.$el.find(".fr-marker").remove(), j.append(jq.FroalaEditor.INVISIBLE_SPACE + jq.FroalaEditor.MARKERS).removeAttr("data-first"), j.attr("data-text") && j.replaceWith(j.html());
				else {
					b.$el.find("table").filter(function() {
						var b = jq(this).find("[data-del-cell]").length > 0 && jq(this).find("[data-del-cell]").length == jq(this).find("td, th").length;
						return b
					}).remove(), b.$el.find("[data-del-cell]").removeAttr("data-del-cell");
					for (var e = b.$el.find('.fr-marker[data-type="true"]'), f = 0; f < e.length; f++) {
						var m = e[f],
							o = m.nextSibling,
							p = b.$el.find('.fr-marker[data-type="false"][data-id="' + jq(m).data("id") + '"]').get(0);
						if (p) {
							if (o && o == p);
							else if (m) {
								var q = b.node.blockParent(m),
									r = b.node.blockParent(p);
								if (jq(m).after(p), q == r);
								else if (null == q) {
									var t = b.node.deepestParent(m);
									t ? (jq(t).after(jq(r).html()), jq(r).remove()) : 0 == jq(r).parentsUntil(b.$el, "table").length && (jq(m).next().after(jq(r).html()), jq(r).remove())
								} else if (null == r && 0 == jq(q).parentsUntil(b.$el, "table").length) {
									for (var o = q; !o.nextSibling && o.parentNode != b.$el.get(0);) o = o.parentNode;
									for (o = o.nextSibling; o && "BR" != o.tagName;) {
										var u = o.nextSibling;
										jq(q).append(o), o = u
									}
								} else 0 == jq(q).parentsUntil(b.$el, "table").length && 0 == jq(r).parentsUntil(b.$el, "table").length && (jq(q).append(jq(r).html()), jq(r).remove())
							}
						} else p = jq(m).clone().attr("data-type", false), jq(m).after(p)
					}
				}
			}
			b.opts.keepFormatOnDelete || b.html.fillEmptyBlocks(true), b.html.cleanEmptyTags(true), b.clean.lists(), b.html.normalizeSpaces(), l()
		}
		function v(c) {
			if (jq(c).find(".fr-marker").length > 0) return false;
			for (var d = b.node.contents(c); d.length && b.node.isBlock(d[0]);) c = d[0], d = b.node.contents(c);
			jq(c).prepend(jq.FroalaEditor.MARKERS)
		}
		function w(c) {
			if (jq(c).find(".fr-marker").length > 0) return false;
			for (var d = b.node.contents(c); d.length && b.node.isBlock(d[d.length - 1]);) c = d[d.length - 1], d = b.node.contents(c);
			jq(c).append(jq.FroalaEditor.MARKERS)
		}
		function x(c) {
			for (var d = c.previousSibling; d && d.nodeType == Node.TEXT_NODE && 0 == d.textContent.length;) d = d.previousSibling;
			return d ? (b.node.isBlock(d) ? w(d) : "BR" == d.tagName ? jq(d).before(jq.FroalaEditor.MARKERS) : jq(d).after(jq.FroalaEditor.MARKERS), true) : false
		}
		function y(c) {
			for (var d = c.nextSibling; d && d.nodeType == Node.TEXT_NODE && 0 == d.textContent.length;) d = d.nextSibling;
			return d ? (b.node.isBlock(d) ? v(d) : jq(d).before(jq.FroalaEditor.MARKERS), true) : false
		}
		return {
			require: ["markers"],
			text: c,
			get: d,
			ranges: e,
			clear: f,
			element: g,
			endElement: h,
			save: k,
			restore: l,
			isCollapsed: o,
			isFull: q,
			inEditor: t,
			remove: u,
			blocks: j,
			info: p,
			setAtEnd: w,
			setAtStart: v,
			setBefore: x,
			setAfter: y
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.edit = function(a) {
		function b() {
			a.browser.mozilla && (a.document.execCommand("enableObjectResizing", false, "false"), a.document.execCommand("enableInlineTableEditing", false, "false"))
		}
		function c() {
			a.$wp && (a.$el.attr("contenteditable", true), a.$el.removeClass("fr-disabled"), a.$tb && a.$tb.removeClass("fr-disabled"), b()), f = false
		}
		function d() {
			a.$wp && (a.$el.attr("contenteditable", false), a.$el.addClass("fr-disabled"), a.$tb.addClass("fr-disabled")), f = true
		}
		function e() {
			return f
		}
		var f = false;
		return {
			on: c,
			off: d,
			disableDesign: b,
			isDisabled: e
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.events = function(b) {
		function c(a, c, d) {
			a.on(c.split(" ").join("." + b.id + " ") + "." + b.id, d), r("destroy", function() {
				a.off(c.split(" ").join("." + b.id + " ") + "." + b.id)
			})
		}
		function d() {
			c(b.$el, "cut copy paste", function(a) {
				s(a.type, [a])
			})
		}
		function e() {
			c(b.$el, "click mouseup mousedown touchstart touchend dragenter dragover drop", function(a) {
				s(a.type, [a])
			})
		}
		function f() {
			c(b.$el, "keydown keypress keyup input", function(a) {
				s(a.type, [a])
			})
		}
		function g() {
			c(b.$window, b._mousedown, function(a) {
				s("window.mousedown", [a]), n()
			}), c(b.$window, b._mouseup, function(a) {
				s("window.mouseup", [a])
			}), c(b.$window, "keydown keyup touchmove", function(a) {
				s("window." + a.type, [a])
			})
		}
		function h() {
			c(b.$document, "drop", function(a) {
				s("document.drop", [a])
			})
		}
		function i(c) {
			if ("undefined" == typeof c && (c = true), !b.$wp) return false;
			if (!b.core.hasFocus() && c) return b.$el.focus(), false;
			if (!b.core.hasFocus() || b.$el.find(".fr-marker").length > 0) return false;
			var d = b.selection.info(b.$el.get(0));
			if (d.atStart && b.selection.isCollapsed() && null != b.html.defaultTag()) {
				b.markers.insert();
				
				var e = b.$el.find(".fr-marker:first").get(0);
				if (e && !b.node.blockParent(e)) {
					jq(e).remove();
					
					var f = b.$el.find(b.html.blockTagsQuery()).get(0);
					f && (jq(f).prepend(jq.FroalaEditor.MARKERS), b.selection.restore())
				} else e && jq(e).remove()
			}
		}
		function j() {
			c(b.$el, "focus", function(a) {
				p() && (i(false), y === false && s(a.type, [a]))
			}), c(b.$el, "blur", function(a) {
				p() && y === true && s(a.type, [a])
			}), r("focus", function() {
				y = true
			}), r("blur", function() {
				y = false
			})
		}
		function k() {
			b.helpers.isMobile() ? (b._mousedown = "touchstart", b._mouseup = "touchend", b._move = "touchmove", b._mousemove = "touchmove") : (b._mousedown = "mousedown", b._mouseup = "mouseup", b._move = "", b._mousemove = "mousemove")
		}
		function l(c) {
			var d = jq(c.currentTarget);
			return b.edit.isDisabled() || d.hasClass("fr-disabled") ? (c.preventDefault(), false) : "mousedown" === c.type && 1 !== c.which ? true : (b.helpers.isMobile() || c.preventDefault(), b.helpers.isAndroid() && 0 === d.parents(".fr-dropdown-menu").length && (c.preventDefault(), c.stopPropagation()), d.addClass("fr-selected"), void b.events.trigger("commands.mousedown", [d]))
		}
		function m(c, d) {
			var e = jq(c.currentTarget);
			if (b.edit.isDisabled() || e.hasClass("fr-disabled")) return c.preventDefault(), false;
			if ("mouseup" === c.type && 1 !== c.which) return true;
			if (!e.hasClass("fr-selected")) return true;
			if ("touchmove" != c.type) {
				if (c.stopPropagation(), c.stopImmediatePropagation(), c.preventDefault(), !e.hasClass("fr-selected")) return jq(".fr-selected").removeClass("fr-selected"), false;
				if (jq(".fr-selected").removeClass("fr-selected"), e.data("dragging") || e.attr("disabled")) return e.removeData("dragging"), false;
				var f = e.data("timeout");
				f && (clearTimeout(f), e.removeData("timeout")), d.apply(b, [c])
			} else e.data("timeout") || e.data("timeout", setTimeout(function() {
				e.data("dragging", true)
			}, 100))
		}
		function n() {
			w = true
		}
		function o() {
			w = false
		}
		function p() {
			return w
		}
		function q(a, c, d) {
			a.on(b._mousedown, c, function(a) {
				l(a)
			}), a.on(b._mouseup + " " + b._move, c, function(a) {
				m(a, d)
			}), a.on("mousedown click mouseup", c, function(a) {
				a.stopPropagation()
			}), r("window.mouseup", function() {
				a.find(c).removeClass("fr-selected"), n()
			}), r("destroy", function() {
				a.off(b._mousedown, c), a.off(b._mouseup + " " + b._move)
			})
		}
		function r(a, b, c) {
			"undefined" == typeof c && (c = false);
			var d = x[a] = x[a] || [];
			c ? d.unshift(b) : d.push(b)
		}
		function s(c, d, e) {
			if (!b.edit.isDisabled() || e) {
				var f, g = x[c];
				if (g) for (var h = 0; h < g.length; h++) if (f = g[h].apply(b, d), f === false) return false;
				return f = b.$original_element.triggerHandler("froalaEditor." + c, jq.merge([b], d || [])), f === false ? false : f
			}
		}
		function t(c, d, e) {
			if (!b.edit.isDisabled() || e) {
				var f = x[c];
				if (f) for (var g = 0; g < f.length; g++) d = f[g].apply(b, [d]) || d;
				return d = b.$original_element.triggerHandler("froalaEditor." + c, jq.merge([b], [d])) || d
			}
		}
		function u() {
			for (var a in x) delete x[a]
		}
		function v() {
			k(), e(), g(), h(), f(), j(), n(), d(), r("destroy", u)
		}
		var w, x = {},
			y = false;
		return {
			require: ["helpers"],
			_init: v,
			on: r,
			trigger: s,
			bindClick: q,
			disableBlur: o,
			enableBlur: n,
			blurActive: p,
			focus: i,
			chainTrigger: t
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.XS = 0, jq.FroalaEditor.SM = 1, jq.FroalaEditor.MD = 2, jq.FroalaEditor.LG = 3, jq.FroalaEditor.MODULES.helpers = function(b) {
		function c() {
			var a, b, c = -1;
			return "Microsoft Internet Explorer" == navigator.appName ? (a = navigator.userAgent, b = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})"), null !== b.exec(a) && (c = parseFloat(RegExp.$1))) : "Netscape" == navigator.appName && (a = navigator.userAgent, b = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})"), null !== b.exec(a) && (c = parseFloat(RegExp.$1))), c
		}
		function d() {
			var a = {};
			
			if (c() > 0) a.msie = true;
			else {
				var b = navigator.userAgent.toLowerCase(),
					d = /(chrome)[ \/]([\w.]+)/.exec(b) || /(webkit)[ \/]([\w.]+)/.exec(b) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b) || /(msie) ([\w.]+)/.exec(b) || b.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b) || [],
					e = {
						browser: d[1] || "",
						version: d[2] || "0"
					};
				
				d[1] && (a[e.browser] = true), parseInt(e.version, 10) < 9 && a.msie && (a.oldMsie = true), a.chrome ? a.webkit = true : a.webkit && (a.safari = true)
			}
			return a
		}
		function e() {
			return /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !h()
		}
		function f() {
			return /(Android)/g.test(navigator.userAgent) && !h()
		}
		function g() {
			return /(Blackberry)/g.test(navigator.userAgent)
		}
		function h() {
			return /(Windows Phone)/gi.test(navigator.userAgent)
		}
		function i() {
			return f() || e() || g()
		}
		function j() {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function(a) {
				window.setTimeout(a, 1e3 / 60)
			}
		}
		function k(a) {
			return parseInt(a, 10) || 0
		}
		function l() {
			var b = jq('<div class="fr-visibility-helper"></div>').appendTo("body"),
				c = k(b.css("margin-left"));
			return b.remove(), c
		}
		function m() {
			return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch
		}
		function n(a) {
			if (!/^(https?:|ftps?:|)\/\//.test(a)) return false;
			a = String(a).replace(/</g, "%3C").replace(/>/g, "%3E").replace(/"/g, "%22").replace(/ /g, "%20");
			var b = /\(?(?:(https?:|ftps?:|)\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|(?:www.)?(?:[^\W\s]|\.|-)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
			return b.test(a)
		}
		function o(a) {
			if (/^(https?:|ftps?:|)\/\//.test(a)) {
				if (!n(a)) return ""
			} else a = encodeURIComponent(a).replace(/%23/g, "#").replace(/%2F/g, "/").replace(/%25/g, "%").replace(/mailto%3A/g, "mailto:").replace(/tel%3A/g, "tel:").replace(/data%3Aimage/g, "data:image").replace(/webkit-fake-url%3A/g, "webkit-fake-url:").replace(/%3F/g, "?").replace(/%3D/g, "=").replace(/%26/g, "&").replace(/&amp;/g, "&").replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2B/g, "+").replace(/%40/g, "@");
			return a
		}
		function p(a) {
			return a && !a.propertyIsEnumerable("length") && "object" == typeof a && "number" == typeof a.length
		}
		function q(a) {
			function b(a) {
				return ("0" + parseInt(a, 10).toString(16)).slice(-2)
			}
			try {
				return a && "transparent" !== a ? /^#[0-9A-F]{6}$/i.test(a) ? a : (a = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/), ("#" + b(a[1]) + b(a[2]) + b(a[3])).toUpperCase()) : ""
			} catch (c) {
				return null
			}
		}
		function r() {
			b.browser = d(), b.ie_version = c()
		}
		return {
			_init: r,
			isIOS: e,
			isAndroid: f,
			isBlackberry: g,
			isWindowsPhone: h,
			isMobile: i,
			requestAnimationFrame: j,
			getPX: k,
			screenSize: l,
			isTouch: m,
			sanitizeURL: o,
			isArray: p,
			RGBToHex: q
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.UNICODE_NBSP = String.fromCharCode(160), 
	jq.FroalaEditor.VOID_ELEMENTS = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"],
	
	// BLOCK ELEMENTS DEFINED HERE 
	jq.FroalaEditor.BLOCK_TAGS = ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "blockquote", "ul", "ol", "li", "table", "td", "th", "thead", "tfoot", "tbody", "tr", "hr"], 
	
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		htmlAllowedEmptyTags: ["textarea", "a", "iframe", "object", "video", "style", "script"],
		htmlSimpleAmpersand: false
	}), 
	
	jq.FroalaEditor.MODULES.html = function(editor) {
		function htmlDefaultTag() {
			return editor.opts.enter == jq.FroalaEditor.ENTER_P ? "p" : editor.opts.enter == jq.FroalaEditor.ENTER_DIV ? "div" : editor.opts.enter == jq.FroalaEditor.ENTER_BR ? null : void 0
		}
		function htmlEmptyBlocks(c) {
			"undefined" == typeof c && (c = false);
			var d, g, h = [];
			if (c) for (d = editor.$el.find(htmlBlockTagsQuery()), g = 0; g < d.length; g++) {
				for (var i = editor.node.contents(d[g]), j = false, k = 0; k < i.length; k++) if (i[k].nodeType != Node.COMMENT_NODE && (i[k].nodeType == Node.ELEMENT_NODE && jq.FroalaEditor.VOID_ELEMENTS.indexOf(i[k].tagName.toLowerCase()) >= 0 || i[k].textContent && i[k].textContent.replace(/\u200B/g, "").length > 0)) {
					j = true;
					break
				}
				j || 0 !== jq(d[g]).find(htmlBlockTagsQuery()).length || h.push(d[g])
			} else
			for (d = editor.$el.find(htmlEmptyBlockTagsQuery()), g = 0; g < d.length; g++) 0 === jq(d[g]).find(htmlBlockTagsQuery()).length && h.push(d[g]);
			return jq(jq.makeArray(h))
		}
		function htmlEmptyBlockTagsQuery() {
			return jq.FroalaEditor.BLOCK_TAGS.join(":empty, ") + ":empty"
		}
		function htmlBlockTagsQuery() {
			return jq.FroalaEditor.BLOCK_TAGS.join(", ")
		}
		function htmlCleanEmptyTags() {
			var c = jq.merge(["TD", "TH"], jq.FroalaEditor.VOID_ELEMENTS);
			c = jq.merge(c, editor.opts.htmlAllowedEmptyTags);
			var d;
			do d = editor.$el.find("*:empty").not(c.join(", ") + ", .fr-marker"), d.remove(), d = editor.$el.find("*:empty").not(c.join(", ") + ", .fr-marker");
			while (d.length)
		}
		function h(d, e) {
			var f = htmlDefaultTag();
			
			if (e && (f = 'div class="fr-temp-div"'), f) for (var g = editor.node.contents(d.get(0)), h = null, i = 0; i < g.length; i++) {
				var j = g[i];
				if (j.nodeType == Node.ELEMENT_NODE && editor.node.isBlock(j)) h = null;
				else if (j.nodeType != Node.ELEMENT_NODE && j.nodeType != Node.TEXT_NODE) h = null;
				else if (j.nodeType == Node.ELEMENT_NODE && "BR" == j.tagName) if (null == h) e ? jq(j).replaceWith("<" + f + ' data-empty="true"><br/></div>') : jq(j).replaceWith(jq("<" + f + ">"));
				else {
					jq(j).remove();
					
					for (var k = editor.node.contents(h), l = false, m = 0; m < k.length; m++) if (!jq(k[m]).hasClass("fr-marker")) {
						l = true;
						break
					}
					l === false && (h.append("<br>"), h.data("empty", true)), h = null
				} else null == h && (h = jq("<" + f + ">"), jq(j).before(h)), j.nodeType == Node.TEXT_NODE && jq(j).text().trim().length > 0 ? (h.append(jq(j).clone()), jq(j).remove()) : h.append(jq(j))
			}
		}
		function htmlWrap(c, d, e) {
			return editor.$wp ? ("undefined" == typeof c && (c = false), "undefined" == typeof d && (d = false), "undefined" == typeof e && (e = false), h(editor.$el, c), editor.$el.find(".fr-inner").each(function() {
				h(jq(this), c)
			}), d && editor.$el.find("td, th").each(function() {
				h(jq(this), c)
			}), void(e && editor.$el.find("blockquote").each(function() {
				h(jq(this), c)
			}))) : false
		}
		function htmlUnwrap() {
			editor.$el.find("div.fr-temp-div").each(function() {
				jq(this).data("empty") || "LI" == this.parentNode.tagName ? jq(this).replaceWith(jq(this).html()) : jq(this).replaceWith(jq(this).html() + "<br>")
			})
		}
		function htmlFillEmptyBlocks(a) {
			htmlEmptyBlocks(a).not("hr").append("<br/>")
		}
		function htmlBlocks() {
			return editor.$el.find(htmlBlockTagsQuery())
		}
		function m(a) {
			"undefined" == typeof a && (a = editor.$el.get(0));
			for (var c = editor.node.contents(a), d = c.length - 1; d >= 0; d--) if (c[d].nodeType == Node.TEXT_NODE && editor.node.isBlock(a)) {
				for (var e = -1; e != c[d].textContent.length;) e = c[d].textContent.length, c[d].textContent = c[d].textContent.replace(/(?!^)  (?!$)/g, " ");
				c[d].textContent = c[d].textContent.replace(/^  /g, " "), c[d].textContent = c[d].textContent.replace(/  $/g, " "), editor.node.isBlock(a) && (c[d].previousSibling || (c[d].textContent = c[d].textContent.replace(/^ */, "")), c[d].nextSibling || (c[d].textContent = c[d].textContent.replace(/ *$/, "")))
			} else m(c[d])
		}
		function htmlNormalizeSpaces(c) {
			if ("undefined" == typeof c && (c = editor.$el.get(0)), c.nodeType == Node.ELEMENT_NODE) for (var d = editor.node.contents(c), e = d.length - 1; e >= 0; e--) jq(d[e]).hasClass("fr-marker") || htmlNormalizeSpaces(d[e]);
			else if (c.nodeType == Node.TEXT_NODE && c.textContent.length > 0) {
				var f = c.previousSibling,
					g = c.nextSibling;
				if (editor.node.isBlock(f) && editor.node.isBlock(g) && 0 === c.textContent.trim().length) jq(c).remove();
				else {
					var h = c.textContent;
					h = h.replace(new RegExp(jq.FroalaEditor.UNICODE_NBSP, "g"), " ");
					for (var i = "", j = 0; j < h.length; j++) i += 32 != h.charCodeAt(j) || 0 !== j && 32 != i.charCodeAt(j - 1) ? h[j] : jq.FroalaEditor.UNICODE_NBSP;
					c.nextSibling || (i = i.replace(/ $/, jq.FroalaEditor.UNICODE_NBSP)), c.previousSibling && !editor.node.isVoid(c.previousSibling) && (i = i.replace(/^\u00A0([^ $])/, " $1")), i = i.replace(/([^ \u00A0])\u00A0([^ \u00A0])/g, "$1 $2"), c.textContent != i && (c.textContent = i)
				}
			}
		}
		function o(a, b, c) {
			var d = new RegExp(b, "gi"),
				e = d.exec(a);
			return e ? e[c] : null
		}
		function p(c) {
			var d = jq("<div " + c + ">");
			return editor.node.rawAttributes(d.get(0))
		}
		function q(a, b) {
			var c = a.match(/<!DOCTYPE ?([^ ]*) ?([^ ]*) ?"?([^"]*)"? ?"?([^"]*)"?>/i);
			return c ? b.implementation.createDocumentType(c[1], c[3], c[4]) : b.implementation.createDocumentType("html")
		}
		function htmlGetDoctype(a) {
			var b = a.doctype,
				c = "<!DOCTYPE html>";
			return b && (c = "<!DOCTYPE " + b.name + (b.publicId ? ' PUBLIC "' + b.publicId + '"' : "") + (!b.publicId && b.systemId ? " SYSTEM" : "") + (b.systemId ? ' "' + b.systemId + '"' : "") + ">"), c
		}
		function s() {
			htmlWrap(), m(), htmlCleanEmptyTags(), htmlNormalizeSpaces(), htmlFillEmptyBlocks(true), editor.clean.quotes(), editor.clean.lists(), editor.clean.tables(), editor.clean.toHTML5(), editor.clean.quotes(), editor.placeholder.refresh(), editor.selection.restore(), htmlCheckIfEmpty()
		}
		function htmlCheckIfEmpty() {
			null != htmlDefaultTag() && editor.core.isEmpty() && 0 === editor.$el.find(htmlBlockTagsQuery()).length && (editor.core.hasFocus() ? (editor.$el.html("<" + htmlDefaultTag() + ">" + jq.FroalaEditor.MARKERS + "<br/></" + htmlDefaultTag() + ">"), editor.selection.restore()) : editor.$el.html("<" + htmlDefaultTag() + "><br/></" + htmlDefaultTag() + ">"))
		}
		
		function htmlSet(new_html) {
			var c = editor.clean.html(new_html, [], [], editor.opts.fullPage);
			if (c = c.replace(/\r|\n/g, ""), editor.opts.fullPage) {
				var d = (o(c, "<body[^>]*?>([\\w\\W]*)</body>", 1) || c).replace(/\r|\n/g, ""),
					e = p(o(c, "<body([^>]*?)>", 1) || ""),
					f = o(c, "<head[^>]*?>([\\w\\W]*)</head>", 1) || "<head><title></title></head>",
					g = p(o(c, "<head([^>]*?)>", 1) || ""),
					h = o(c, "<!DOCTYPE([^>]*?)>", 0) || "<!DOCTYPE html>",
					i = p(o(c, "<html([^>]*?)>", 1) || "");
				editor.$el.html(d), editor.node.clearAttributes(editor.$el.get(0)), editor.$el.attr(e), editor.$head.html(f), editor.node.clearAttributes(editor.$head.get(0)), editor.$head.attr(g), editor.node.clearAttributes(editor.$html.get(0)), editor.$html.attr(i), editor.iframe_document.doctype.parentNode.replaceChild(q(h, editor.iframe_document), editor.iframe_document.doctype)
			} else {
				editor.$el.html(c);
			}
			editor.edit.on(), 
			editor.core.injectStyle(editor.opts.iframeStyle), 
			s(), 
			editor.events.trigger("html.set")
		}
		
		function htmlGet(a) {
			var c = "";
			editor.events.trigger("html.beforeGet"), editor.core.isEmpty() || ("undefined" == typeof a && (a = false), editor.opts.fullPage ? (c = htmlGetDoctype(editor.iframe_document), c += "<html" + editor.node.attributes(editor.$html.get(0)) + ">" + editor.$html.html() + "</html>") : c = editor.$el.html()), c = c.replace(/<pre(?:[\w\W]*?)>(?:[\w\W]*?)<\/pre>/g, function(a) {
				return a.replace(/<br>/g, "\n")
			}), editor.opts.fullPage && (c = c.replace(/<style data-fr-style="true">(?:[\w\W]*?)<\/style>/g, ""), c = c.replace(/<style(?:[\w\W]*?)class="firebugResetStyles"(?:[\w\W]*?)>(?:[\w\W]*?)<\/style>/g, ""), c = c.replace(/<body((?:[\w\W]*?)) spellcheck="true"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$2>$3</body>"), c = c.replace(/<body((?:[\w\W]*?)) contenteditable="(true|false)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$3>$4</body>"), c = c.replace(/<body((?:[\w\W]*?)) dir="([\w]*)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$3>$4</body>"), c = c.replace(/<body((?:[\w\W]*?))class="([\w\W]*?)(fr-rtl|fr-ltr)([\w\W]*?)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, '<body$1class="$2$4"$5>$6</body>'), c = c.replace(/<body((?:[\w\W]*?)) class=""((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$2>$3</body>")), editor.opts.htmlSimpleAmpersand && (c = c.replace(/\&amp;/gi, "&")), editor.events.trigger("html.afterGet"), a || (c = c.replace(/<span[^>]*? class\s*=\s*["']?fr-marker["']?[^>]+>\u200b<\/span>/gi, "")), c = editor.clean.invisibleSpaces(c);
			var d = editor.events.chainTrigger("html.get", c);
			return "string" == typeof d && (c = d), c
		}
		function htmlGetSelected() {
			var c = function(c, d) {
				for (; d && (d.nodeType == Node.TEXT_NODE || !editor.node.isBlock(d));) d && d.nodeType != Node.TEXT_NODE && jq(c).wrapInner(editor.node.openTagString(d) + editor.node.closeTagString(d)), d = d.parentNode;
				d && c.innerHTML == d.innerHTML && (c.innerHTML = d.outerHTML)
			},
				d = function() {
					var c, d = null;
					return editor.window.getSelection ? (c = editor.window.getSelection(), c && c.rangeCount && (d = c.getRangeAt(0).commonAncestorContainer, d.nodeType != Node.ELEMENT_NODE && (d = d.parentNode))) : (c = editor.document.selection) && "Control" != c.type && (d = c.createRange().parentElement()), null != d && (jq.inArray(editor.$el.get(0), jq(d).parents()) >= 0 || d == editor.$el.get(0)) ? d : null
				},
				e = "";
			if ("undefined" != typeof editor.window.getSelection) {
				editor.browser.mozilla && (editor.selection.save(), editor.$el.find('.fr-marker[data-type="false"]').length > 1 && (editor.$el.find('.fr-marker[data-type="false"][data-id="0"]').remove(), editor.$el.find('.fr-marker[data-type="false"]:last').attr("data-id", "0"), editor.$el.find(".fr-marker").not('[data-id="0"]').remove()), editor.selection.restore());
				for (var f = editor.selection.ranges(), g = 0; g < f.length; g++) {
					var h = document.createElement("div");
					h.appendChild(f[g].cloneContents()), c(h, d()), e += h.innerHTML
				}
			} else "undefined" != typeof editor.document.selection && "Text" == editor.document.selection.type && (e = editor.document.selection.createRange().htmlText);
			return e
		}
		function x(b) {
			var c = jq("<div>").html(b);
			return c.find(htmlBlockTagsQuery()).length > 0
		}
		function y(c) {
			var d = jq("<div>").html(c);
			return editor.selection.setAtEnd(d.get(0)), d.html()
		}
		function htmlEscapeEntities(a) {
			return a.replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/"/gi, "&quot;").replace(/'/gi, "&apos;")
		}
		function htmlInsert(c, d) {
			"" !== editor.selection.text() && editor.selection.remove();
			
			var e;
			if (e = d ? c : editor.clean.html(c), c.indexOf('class="fr-marker"') < 0 && (e = y(e)), editor.core.isEmpty()) editor.$el.html(e);
			else {
				editor.markers.insert();
				
				var f, g = editor.$el.find(".fr-marker").get(0);
				if (x(e) && (f = editor.node.deepestParent(g))) if (editor.node.isBlock(f) && editor.node.isEmpty(f)) jq(f).replaceWith(e);
				else {
					var h = g,
						i = "",
						j = "";
					do h = h.parentNode, i += editor.node.closeTagString(h), j = editor.node.openTagString(h) + j;
					while (h != f);
					jq(g).replaceWith('<span id="fr-break"></span>');
					var k = editor.node.openTagString(f) + jq(f).html() + editor.node.closeTagString(f);
					k = k.replace(/<span id="fr-break"><\/span>/g, i + e + j), jq(f).replaceWith(k)
				} else jq(g).replaceWith(e)
			}
			s()
		}
		function htmlCleanWhiteTags(c) {
			var d = null;
			"undefined" == typeof c && (d = editor.selection.element());
			var e, f;
			do {
				f = false, e = editor.$el.find("*").not(d).not(".fr-marker");
				for (var g = 0; g < e.length; g++) {
					var h = e.get(g),
						i = h.textContent;
					0 === jq(h).find("*").length && 1 === i.length && 8203 == i.charCodeAt(0) && (jq(h).remove(), f = true)
				}
			} while 
			(f)
		}
		function init() {
			var a = function() {
				htmlCleanWhiteTags(), editor.placeholder && editor.placeholder.refresh()
			};
			
			editor.events.on("mouseup", a), editor.events.on("keydown", a), editor.events.on("contentChanged", htmlCheckIfEmpty)
		}
		return {
			require: ["selection", "clean"],
			defaultTag: htmlDefaultTag,
			emptyBlocks: htmlEmptyBlocks,
			emptyBlockTagsQuery: htmlEmptyBlockTagsQuery,
			blockTagsQuery: htmlBlockTagsQuery,
			fillEmptyBlocks: htmlFillEmptyBlocks,
			cleanEmptyTags: htmlCleanEmptyTags,
			cleanWhiteTags: htmlCleanWhiteTags,
			normalizeSpaces: htmlNormalizeSpaces,
			blocks: htmlBlocks,
			getDoctype: htmlGetDoctype,
			set: htmlSet,
			get: htmlGet,
			getSelected: htmlGetSelected,
			insert: htmlInsert,
			wrap: htmlWrap,
			unwrap: htmlUnwrap,
			escapeEntities: htmlEscapeEntities,
			checkIfEmpty: htmlCheckIfEmpty,
			_init: init
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.ENTER_P = 0, 
	jq.FroalaEditor.ENTER_DIV = 1, 
	jq.FroalaEditor.ENTER_BR = 2, 
	jq.FroalaEditor.KEYCODE = {
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		ESC: 27,
		SPACE: 32,
		DELETE: 46,
		ZERO: 48,
		ONE: 49,
		TWO: 50,
		THREE: 51,
		FOUR: 52,
		FIVE: 53,
		SIX: 54,
		SEVEN: 55,
		EIGHT: 56,
		NINE: 57,
		FF_SEMICOLON: 59,
		FF_EQUALS: 61,
		QUESTION_MARK: 63,
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		META: 91,
		NUM_ZERO: 96,
		NUM_ONE: 97,
		NUM_TWO: 98,
		NUM_THREE: 99,
		NUM_FOUR: 100,
		NUM_FIVE: 101,
		NUM_SIX: 102,
		NUM_SEVEN: 103,
		NUM_EIGHT: 104,
		NUM_NINE: 105,
		NUM_MULTIPLY: 106,
		NUM_PLUS: 107,
		NUM_MINUS: 109,
		NUM_PERIOD: 110,
		NUM_DIVISION: 111,
		SEMICOLON: 186,
		DASH: 189,
		EQUALS: 187,
		COMMA: 188,
		PERIOD: 190,
		SLASH: 191,
		APOSTROPHE: 192,
		TILDE: 192,
		SINGLE_QUOTE: 222,
		OPEN_SQUARE_BRACKET: 219,
		BACKSLASH: 220,
		CLOSE_SQUARE_BRACKET: 221
	}, 
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		enter: jq.FroalaEditor.ENTER_P,
		multiLine: true,
		tabSpaces: 0
	}), 
	jq.FroalaEditor.MODULES.keys = function(b) {
		function c(a) {
			a.preventDefault(), 
			a.stopPropagation(), 
			b.opts.multiLine && ("" !== b.selection.text() && b.selection.remove(), b.cursor.enter())
		}
		function d(a) {
			a.preventDefault(), 
			a.stopPropagation(), 
			b.opts.multiLine && ("" !== b.selection.text() && b.selection.remove(), b.cursor.enter(true))
		}
		function e(a) {
			a.preventDefault(), 
			a.stopPropagation(), 
			"" === b.selection.text() ? b.cursor.backspace() : (b.selection.remove(), b.html.fillEmptyBlocks(true)), b.placeholder.refresh()
		}
		function f(a) {
			a.preventDefault(), 
			a.stopPropagation(), 
			"" === b.selection.text() ? b.cursor.del() : b.selection.remove(), b.placeholder.refresh()
		}
		function g(c) {
			if (b.browser.mozilla) {
				c.preventDefault(), c.stopPropagation(), b.selection.isCollapsed() || b.selection.remove(), b.markers.insert();
				
				var d = b.$el.find(".fr-marker").get(0),
					e = d.previousSibling;
				e && e.nodeType == Node.TEXT_NODE && 1 == e.textContent.length && 160 == e.textContent.charCodeAt(0) ? jq(e).after(" ") : jq(d).before("&nbsp;"), jq(d).replaceWith(jq.FroalaEditor.MARKERS), b.selection.restore()
			}
		}
		function h() {
			if (b.browser.mozilla && b.selection.isCollapsed() && !w) {
				var a = b.selection.ranges(0),
					c = a.startContainer,
					d = a.startOffset;
				c && c.nodeType == Node.TEXT_NODE && d <= c.textContent.length && d > 0 && 32 == c.textContent.charCodeAt(d - 1) && (b.selection.save(), b.html.normalizeSpaces(), b.selection.restore())
			}
		}
		function i() {
			b.selection.isFull() && setTimeout(function() {
				var c = b.html.defaultTag();
				
				c ? b.$el.html("<" + c + ">" + jq.FroalaEditor.MARKERS + "<br/></" + c + ">") : b.$el.html(jq.FroalaEditor.MARKERS + "<br/>"), b.selection.restore(), b.placeholder.refresh(), b.button.bulkRefresh(), b.undo.saveStep()
			}, 0)
		}
		function j(a) {
			if (b.opts.tabSpaces > 0) {
				a.preventDefault(), a.stopPropagation();
				
				for (var c = "", d = 0; d < b.opts.tabSpaces; d++) c += "&nbsp;";
				b.html.insert(c), b.placeholder.refresh()
			}
		}
		function k(h) {
			b.events.disableBlur();
			
			var i = h.which,
				k = isCharacter(i) && !ctrlKey(h),
				l = i == jq.FroalaEditor.KEYCODE.BACKSPACE || i == jq.FroalaEditor.KEYCODE.DELETE;
			if (b.selection.isFull() && !b.opts.keepFormatOnDelete || l && b.placeholder.isVisible() && b.opts.keepFormatOnDelete) {
				if (k || l) {
					var m = b.html.defaultTag();
					
					m ? b.$el.html("<" + m + ">" + jq.FroalaEditor.MARKERS + "<br/></" + m + ">") : b.$el.html(jq.FroalaEditor.MARKERS + "<br/>")
				}
				b.selection.restore()
			}
			i == jq.FroalaEditor.KEYCODE.ENTER ? h.shiftKey ? d(h) : c(h) : i != jq.FroalaEditor.KEYCODE.BACKSPACE || ctrlKey(h) ? i != jq.FroalaEditor.KEYCODE.DELETE || ctrlKey(h) ? i == jq.FroalaEditor.KEYCODE.SPACE ? g(h) : i == jq.FroalaEditor.KEYCODE.TAB ? j(h) : ctrlKey(h) || !isCharacter(h.which) || b.selection.isCollapsed() || b.selection.remove() : f(h) : e(h), b.events.enableBlur()
		}
		function l(c) {
			for (var d = 0; d < c.length; d++) c[d].nodeType == Node.TEXT_NODE && /\u200B/gi.test(c[d].textContent) ? (c[d].textContent = c[d].textContent.replace(/\u200B/gi, ""), 0 === c[d].textContent.length && jq(c[d]).remove()) : c[d].nodeType == Node.ELEMENT_NODE && "IFRAME" != c[d].nodeType && l(b.node.contents(c[d]))
		}
		function m() {
			var c;
			b.opts.height || b.opts.heightMax ? (c = b.position.getBoundingRect().top, b.opts.iframe && (c += b.$iframe.offset().top), c > b.$wp.offset().top - jq(b.original_window).scrollTop() + b.$wp.height() - 20 && b.$wp.scrollTop(c + b.$wp.scrollTop() - (b.$wp.height() + b.$wp.offset().top) + jq(b.original_window).scrollTop() + 20)) : (c = b.position.getBoundingRect().top, b.opts.iframe && (c += b.$iframe.offset().top), c > jq(b.original_window).height() - 20 && jq(b.original_window).scrollTop(c + jq(b.original_window).scrollTop() - jq(b.original_window).height() + 20), c = b.position.getBoundingRect().top, b.opts.iframe && (c += b.$iframe.offset().top), c < b.$tb.height() + 20 && jq(b.original_window).scrollTop(c + jq(b.original_window).scrollTop() - b.$tb.height() - 20))
		}
		function n() {
			if (m(), w) return false;
			if (!b.selection.isCollapsed()) return false;
			for (var c = b.$el.find(b.html.blockTagsQuery()).andSelf().not("TD, TH").find(" > br"), d = 0; d < c.length; d++) {
				var e = c[d],
					f = e.previousSibling,
					g = e.nextSibling,
					h = b.node.blockParent(e) || b.$el.get(0);
				f && h && "BR" != f.tagName && !b.node.isBlock(f) && !g && jq(h).text().replace(/\u200B/g, "").length > 0 && jq(f).text().length > 0 && (b.selection.save(), jq(e).remove(), b.selection.restore())
			}
			var i = function(b) {
				if (!b) return false;
				var c = jq(b).html();
				
				return c = c.replace(/<span[^>]*? class\s*=\s*["']?fr-marker["']?[^>]+>\u200b<\/span>/gi, ""), c && /\u200B/.test(c) && c.replace(/\u200B/gi, "").length > 0 ? true : false
			},
				j = b.selection.element();
			
			i(j) && 0 === jq(j).find("li").length && !jq(j).hasClass("fr-marker") && "IFRAME" != j.tagName && (b.selection.save(), l(b.node.contents(j)), b.selection.restore())
		}
		function ctrlKey(a) {
			if (-1 != navigator.userAgent.indexOf("Mac OS X")) {
				if (a.metaKey && !a.altKey) return true
			} else if (a.ctrlKey && !a.altKey) return true;
			return false
		}
		function isCharacter(c) {
			if (c >= jq.FroalaEditor.KEYCODE.ZERO && c <= jq.FroalaEditor.KEYCODE.NINE) return true;
			if (c >= jq.FroalaEditor.KEYCODE.NUM_ZERO && c <= jq.FroalaEditor.KEYCODE.NUM_MULTIPLY) return true;
			if (c >= jq.FroalaEditor.KEYCODE.A && c <= jq.FroalaEditor.KEYCODE.Z) return true;
			if (b.browser.webkit && 0 === c) return true;
			switch (c) {
				case jq.FroalaEditor.KEYCODE.SPACE:
				case jq.FroalaEditor.KEYCODE.QUESTION_MARK:
				case jq.FroalaEditor.KEYCODE.NUM_PLUS:
				case jq.FroalaEditor.KEYCODE.NUM_MINUS:
				case jq.FroalaEditor.KEYCODE.NUM_PERIOD:
				case jq.FroalaEditor.KEYCODE.NUM_DIVISION:
				case jq.FroalaEditor.KEYCODE.SEMICOLON:
				case jq.FroalaEditor.KEYCODE.FF_SEMICOLON:
				case jq.FroalaEditor.KEYCODE.DASH:
				case jq.FroalaEditor.KEYCODE.EQUALS:
				case jq.FroalaEditor.KEYCODE.FF_EQUALS:
				case jq.FroalaEditor.KEYCODE.COMMA:
				case jq.FroalaEditor.KEYCODE.PERIOD:
				case jq.FroalaEditor.KEYCODE.SLASH:
				case jq.FroalaEditor.KEYCODE.APOSTROPHE:
				case jq.FroalaEditor.KEYCODE.SINGLE_QUOTE:
				case jq.FroalaEditor.KEYCODE.OPEN_SQUARE_BRACKET:
				case jq.FroalaEditor.KEYCODE.BACKSLASH:
				case jq.FroalaEditor.KEYCODE.CLOSE_SQUARE_BRACKET:
					return true;
				default:
					return false
			}
		}
		function q(a) {
			var c = a.which;
			return ctrlKey(a) || c >= 37 && 40 >= c ? true : (u || (v = b.snapshot.get()), clearTimeout(u), void(u = setTimeout(function() {
				u = null, b.undo.saveStep()
			}, 500)))
		}
		function r(a) {
			return ctrlKey(a) ? true : void(v && u && (b.undo.saveStep(v), v = null))
		}
		function forceUndo() {
			u && (clearTimeout(u), b.undo.saveStep(), v = null)
		}
		function init() {
			if (b.events.on("keydown", q), b.events.on("input", h), b.events.on("keyup", r), b.events.on("keydown", k), b.events.on("keyup", n), b.events.on("cut", i), b.$el.get(0).msGetInputContext) try {
				b.$el.get(0).msGetInputContext().addEventListener("MSCandidateWindowShow", function() {
					w = true
				}), b.$el.get(0).msGetInputContext().addEventListener("MSCandidateWindowHide", function() {
					w = false, n()
				})
			} catch (a) {}
		}
		var u, v, w = false;
		return {
			require: ["core", "cursor", "events"],
			_init: init,
			ctrlKey: ctrlKey,
			isCharacter: isCharacter,
			forceUndo: forceUndo
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		language: null
	}), 
	jq.FroalaEditor.LANGUAGE = {}, jq.FroalaEditor.MODULES.language = function(b) {
		function translate(a) {
			return e && e.translation[a] ? e.translation[a] : a
		}
		function init() {
			jq.FroalaEditor.LANGUAGE && (e = jq.FroalaEditor.LANGUAGE[b.opts.language]), e && e.direction && (b.opts.direction = e.direction)
		}
		var e;
		return {
			require: ["core"],
			_init: init,
			translate: translate
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		placeholderText: "Type something",
		placeholderFontFamily: "Arial, Helvetica, sans-serif"
	}), 
	jq.FroalaEditor.MODULES.placeholder = function(b) {
		function c() {
			var c = 0,
				d = b.node.contents(b.$el.get(0));
			d.length && d[0].nodeType == Node.ELEMENT_NODE ? (c = b.helpers.getPX(jq(d[0]).css("margin-top")), b.$placeholder.css("font-size", jq(d[0]).css("font-size")), b.$placeholder.css("line-height", jq(d[0]).css("line-height"))) : (b.$placeholder.css("font-size", b.$el.css("font-size")), b.$placeholder.css("line-height", b.$el.css("line-height"))), b.$wp.addClass("show-placeholder"), b.$placeholder.css("margin-top", c).text(b.opts.placeholderText || b.$original_element.attr("placeholder") || "")
		}
		function d() {
			b.$wp.removeClass("show-placeholder")
		}
		function e() {
			return b.$wp.hasClass("show-placeholder")
		}
		function f() {
			return b.$wp ? void(b.core.isEmpty() ? c() : d()) : false
		}
		function g() {
			f()
		}
		function h() {
			return b.$wp ? (b.$placeholder = jq('<span class="fr-placeholder"></span>'), b.$wp.append(b.$placeholder), b.events.on("init", g), b.events.on("input", f), b.events.on("keydown", f), b.events.on("keyup", f), void b.events.on("contentChanged", f)) : false
		}
		return {
			require: ["events"],
			_init: h,
			show: c,
			hide: d,
			refresh: f,
			isVisible: e
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		height: null,
		heightMax: null,
		heightMin: null,
		width: null
	}), 
	jq.FroalaEditor.MODULES.size = function(a) {
		function b() {
			a.opts.height && a.$el.css("minHeight", a.opts.height - a.helpers.getPX(a.$el.css("padding-top")) - a.helpers.getPX(a.$el.css("padding-bottom"))), a.$iframe.height(a.$el.outerHeight(true))
		}
		function c() {
			a.$wp.height(a.opts.height), a.$el.css("minHeight", a.opts.height - a.helpers.getPX(a.$el.css("padding-top")) - a.helpers.getPX(a.$el.css("padding-bottom"))), a.$el.css("minHeight", a.opts.heightMin), a.$wp.css("maxHeight", a.opts.heightMax), a.$box.width(a.opts.width)
		}
		function d() {
			return a.$wp ? (c(), void(a.opts.iframe && (a.events.on("keyup", b), a.events.on("commands.after", b), a.events.on("html.set", b), a.events.on("init", b), a.events.on("initialized", b)))) : false
		}
		return {
			require: ["events"],
			_init: d,
			syncIframe: b,
			refresh: c
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		pastePlain: false,
		pasteDeniedTags: ["colgroup", "col"],
		pasteDeniedAttrs: ["class", "id", "style"]
	}), 
	jq.FroalaEditor.MODULES.paste = function(froalaEditor) {
		function c(c) {
			l = froalaEditor.html.getSelected(), m = jq("<div>").html(l).text(), "cut" == c.type && (froalaEditor.undo.saveStep(), setTimeout(function() {
				froalaEditor.undo.saveStep()
			}, 0))
		}
		function d(a) {
			if (a.originalEvent && (a = a.originalEvent), froalaEditor.events.trigger("paste.before", [a]) === false) return false;
			if (n = froalaEditor.$window.scrollTop(), a && a.clipboardData && a.clipboardData.getData) {
				var c = "",
					d = a.clipboardData.types;
				if (froalaEditor.helpers.isArray(d)) for (var f = 0; f < d.length; f++) c += d[f] + ";";
				else c = d;
				if (o = "", /text\/html/.test(c) ? o = a.clipboardData.getData("text/html") : /text\/rtf/.test(c) && froalaEditor.browser.safari ? o = a.clipboardData.getData("text/rtf") : /text\/plain/.test(c) && !this.browser.mozilla && (o = froalaEditor.html.escapeEntities(a.clipboardData.getData("text/plain")).replace(/\n/g, "<br>")), "" !== o) return h(), a.preventDefault && (a.stopPropagation(), a.preventDefault()), false;
				o = null
			}
			e()
		}
		function e() {
			froalaEditor.selection.save(), froalaEditor.events.disableBlur(), o = null, p ? p.html("") : (p = jq('<div contenteditable="true" style="position: fixed; top: 0; left: -9999px; height: 100%; width: 0; z-index: 4000; line-height: 140%;" tabindex="-1"></div>'), froalaEditor.$box.after(p)), p.focus(), froalaEditor.window.setTimeout(h, 1)
		}
		function f(c) {
			c = c.replace(/<p(.*?)class="?'?MsoListParagraph"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ul><li>$3</li></ul>"), c = c.replace(/<p(.*?)class="?'?NumberedText"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ol><li>$3</li></ol>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ul><li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ol><li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li></ul>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li></ol>"), c = c.replace(/<span([^<]*?)style="?'?mso-list:Ignore"?'?([\s\S]*?)>([\s\S]*?)<span/gi, "<span><span"), c = c.replace(/<!--\[if \!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi, ""), c = c.replace(/<!\[if \!supportLists\]>([\s\S]*?)<!\[endif\]>/gi, ""), c = c.replace(/(\n|\r| class=(")?Mso[a-zA-Z0-9]+(")?)/gi, " "), c = c.replace(/<!--[\s\S]*?-->/gi, ""), c = c.replace(/<(\/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>/gi, "");
			for (var d = ["style", "script", "applet", "embed", "noframes", "noscript"], e = 0; e < d.length; e++) {
				var f = new RegExp("<" + d[e] + ".*?" + d[e] + "(.*?)>", "gi");
				c = c.replace(f, "")
			}
			c = c.replace(/&nbsp;/gi, " ");
			var g;
			do g = c, c = c.replace(/<[^\/>][^>]*><\/[^>]+>/gi, "");
			while (c != g);
			c = c.replace(/<lilevel([^1])([^>]*)>/gi, '<li data-indent="true"$2>'), c = c.replace(/<lilevel1([^>]*)>/gi, "<li$1>"), c = froalaEditor.clean.html(c, froalaEditor.opts.pasteDeniedTags, froalaEditor.opts.pasteDeniedAttrs), c = c.replace(/<a>(.[^<]+)<\/a>/gi, "$1");
			var h = jq("<div>").html(c);
			return h.find("li[data-indent]").each(function(b, c) {
				var d = jq(c);
				if (d.prev("li").length > 0) {
					var e = d.prev("li").find("> ul, > ol");
					0 === e.length && (e = jq("ul"), d.prev("li").append(e)), e.append(c)
				} else d.removeAttr("data-indent")
			}), c = h.html()
		}
		function g(c) {
			var d = jq("<div>").html(c);
			d.find("p, div, h1, h2, h3, h4, h5, h6, pre, blockquote").each(function(c, d) {
				jq(d).replaceWith("<" + (froalaEditor.html.defaultTag() || "DIV") + ">" + jq(d).html() + "</" + (froalaEditor.html.defaultTag() || "DIV") + ">")
			}), jq(d.find("*").not("p, div, h1, h2, h3, h4, h5, h6, pre, blockquote, ul, ol, li, table, tbody, thead, tr, td, br").get().reverse()).each(function() {
				jq(this).replaceWith(jq(this).html())
			});
			
			var e = function(c) {
				for (var d = froalaEditor.node.contents(c), f = 0; f < d.length; f++) 3 != d[f].nodeType && 1 != d[f].nodeType ? jq(d[f]).remove() : e(d[f])
			};
			
			return e(d.get(0)), d.html()
		}
		function h() {
			froalaEditor.keys.forceUndo();
			
			var c = froalaEditor.snapshot.get();
			
			null === o && (o = p.html(), froalaEditor.events.focus(), froalaEditor.selection.restore(), froalaEditor.events.enableBlur(), froalaEditor.$window.scrollTop(n));
			var d = froalaEditor.events.chainTrigger("paste.beforeCleanup", o);
			if ("string" == typeof d && (o = d), o.indexOf("<body") >= 0 && (o = o.replace(/[.\s\S\w\W<>]*<body[^>]*>([.\s\S\w\W<>]*)<\/body>[.\s\S\w\W<>]*/g, "$1")), o.match(/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/gi) ? (o = f(o), o = j(o), o = froalaEditor.clean.html(o, froalaEditor.opts.pasteDeniedTags, froalaEditor.opts.pasteDeniedAttrs)) : (froalaEditor.opts.htmlAllowComments = false, o = froalaEditor.clean.html(o, froalaEditor.opts.pasteDeniedTags, froalaEditor.opts.pasteDeniedAttrs), froalaEditor.opts.htmlAllowComments = true, o = j(o), o = o.replace(/\r|\n|\t/g, ""), m && jq("<div>").html(o).text().replace(/(\u00A0)/gi, " ").replace(/\r|\n/gi, "") == m.replace(/(\u00A0)/gi, " ").replace(/\r|\n/gi, "") && (o = l)), froalaEditor.opts.pastePlain && (o = g(o)), d = froalaEditor.events.chainTrigger("paste.afterCleanup", o), "string" == typeof d && (o = d), "" !== o) {
				var e = jq("<div>").html(o);
				froalaEditor.html.normalizeSpaces(e.get(0)), o = e.html(), froalaEditor.html.insert(o, true)
			}
			i(), froalaEditor.undo.saveStep(c), froalaEditor.undo.saveStep()
		}
		function i() {
			froalaEditor.events.trigger("paste.after")
		}
		function j(b) {
			for (var c, d = jq("<div>").html(b), e = d.find("*:empty:not(br, img, td, th)"); e.length;) {
				for (c = 0; c < e.length; c++) jq(e[c]).remove();
				
				e = d.find("*:empty:not(br, img, td, th)")
			}
			for (var f = d.find("> div:not([style]), td > div, th > div, li > div"); f.length;) {
				var g = jq(f[f.length - 1]);
				g.replaceWith(g.html() + "<br>"), f = d.find("> div:not([style]), td > div, th > div, li > div")
			}
			for (f = d.find("div:not([style])"); f.length;) {
				for (c = 0; c < f.length; c++) {
					var h = jq(f[c]),
						i = h.html().replace(/\u0009/gi, "").trim();
					
					h.replaceWith(i)
				}
				f = d.find("div:not([style])")
			}
			return d.html()
		}
		function init() {
			froalaEditor.events.on("copy", c), froalaEditor.events.on("cut", c), froalaEditor.events.on("paste", d)
		}
		var l, m, n, o, p;
		return {
			require: ["events", "core"],
			_init: init
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.SHORTCUTS_MAP = {
		69: {
			cmd: "show"
		},
		
		66: {
			cmd: "bold"
		},
		
		73: {
			cmd: "italic"
		},
		
		85: {
			cmd: "underline"
		},
		
		83: {
			cmd: "strikeThrough"
		},
		
		221: {
			cmd: "indent"
		},
		
		219: {
			cmd: "outdent"
		},
		
		90: {
			cmd: "undo"
		},
		
		"-90": {
			cmd: "redo"
		}
	}, jq.extend(jq.FroalaEditor.DEFAULTS, {
		shortcutsEnabled: ["show", "bold", "italic", "underline", "strikeThrough", "indent", "outdent", "undo", "redo"]
	}), jq.FroalaEditor.RegisterShortcut = function(b, c, d, e) {
		jq.FroalaEditor.SHORTCUTS_MAP[b * (e ? -1 : 1)] = {
			cmd: c,
			val: d
		}, jq.FroalaEditor.DEFAULTS.shortcutsEnabled.push(c)
	}, jq.FroalaEditor.MODULES.shortcuts = function(b) {
		function c(c) {
			var d = c.which;
			if (b.keys.ctrlKey(c) && (c.shiftKey && jq.FroalaEditor.SHORTCUTS_MAP[-d] || !c.shiftKey && jq.FroalaEditor.SHORTCUTS_MAP[d])) {
				var e = jq.FroalaEditor.SHORTCUTS_MAP[d * (c.shiftKey ? -1 : 1)].cmd;
				if (e && b.opts.shortcutsEnabled.indexOf(e) >= 0) {
					var f, g = jq.FroalaEditor.SHORTCUTS_MAP[d * (c.shiftKey ? -1 : 1)].val;
					if (e && !g ? f = b.$tb.find('.fr-command[data-cmd="' + e + '"]') : e && g && (f = b.$tb.find('.fr-command[data-cmd="' + e + '"][data-param0="' + g + '"]')), f.length) return c.preventDefault(), c.stopPropagation(), "keydown" == c.type && b.button.exec(f), false;
					if (e && b.commands[e]) return c.preventDefault(), c.stopPropagation(), "keydown" == c.type && b.commands[e](), false
				}
			}
		}
		function d() {
			b.events.on("keydown", c, true), b.events.on("keyup", c, true)
		}
		return {
			require: ["events", "toolbar"],
			_init: d
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.snapshot = function(a) {
		function b(a) {
			for (var b = a.parentNode.childNodes, c = 0, d = null, e = 0; e < b.length; e++) {
				if (d) {
					var f = b[e].nodeType === Node.TEXT_NODE && "" === b[e].textContent,
						g = d.nodeType === Node.TEXT_NODE && b[e].nodeType === Node.TEXT_NODE;
					f || g || c++
				}
				if (b[e] == a) return c;
				d = b[e]
			}
		}
		function c(c) {
			var d = [];
			if (!c.parentNode) return [];
			for (; !a.node.isElement(c);) d.push(b(c)), c = c.parentNode;
			return d.reverse()
		}
		function d(a, b) {
			for (; a && a.nodeType === Node.TEXT_NODE;) {
				var c = a.previousSibling;
				c && c.nodeType == Node.TEXT_NODE && (b += c.textContent.length), a = c
			}
			return b
		}
		function e(a) {
			return {
				scLoc: c(a.startContainer),
				scOffset: d(a.startContainer, a.startOffset),
				ecLoc: c(a.endContainer),
				ecOffset: d(a.endContainer, a.endOffset)
			}
		}
		function f() {
			var b = {};
			
			if (a.events.trigger("snapshot.before"), b.html = a.$el.html(), b.ranges = [], a.selection.inEditor() && a.core.hasFocus()) for (var c = a.selection.ranges(), d = 0; d < c.length; d++) b.ranges.push(e(c[d]));
			return a.events.trigger("snapshot.after"), b
		}
		function g(b) {
			for (var c = a.$el.get(0), d = 0; d < b.length; d++) c = c.childNodes[b[d]];
			return c
		}
		function h(b, c) {
			try {
				var d = g(c.scLoc),
					e = c.scOffset,
					f = g(c.ecLoc),
					h = c.ecOffset,
					i = a.document.createRange();
				
				i.setStart(d, e), i.setEnd(f, h), b.addRange(i)
			} catch (j) {
				console.log(j)
			}
		}
		function restore(b) {
			a.$el.html() != b.html && a.$el.html(b.html);
			var c = a.selection.get();
			
			a.selection.clear(), a.events.focus(true);
			for (var d = 0; d < b.ranges.length; d++) h(c, b.ranges[d])
		}
		function equal(a, b) {
			return a.html != b.html ? false : JSON.stringify(a.ranges) != JSON.stringify(b.ranges) ? false : true
		}
		return {
			require: ["selection"],
			get: f,
			restore: restore,
			equal: equal
		}
	}
}(jQuery), 


function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.button = function(b) {
		function c(c) {
			var d = jq(c.currentTarget),
				e = d.next(),
				f = d.hasClass("fr-active"),
				g = (b.helpers.isMobile(), jq(".fr-dropdown.fr-active").not(d));
			if (b.helpers.isIOS() && 0 == b.$el.find(".fr-marker").length && (b.selection.save(), b.selection.clear(), b.selection.restore()), !f) {
				var h = d.data("cmd");
				e.find(".fr-command").removeClass("fr-active"), jq.FroalaEditor.COMMANDS[h] && jq.FroalaEditor.COMMANDS[h].refreshOnShow && jq.FroalaEditor.COMMANDS[h].refreshOnShow.apply(b, [d, e]), e.css("left", d.offset().left - d.parent().offset().left - ("rtl" == b.opts.direction ? e.width() - d.outerWidth() : 0)), b.opts.toolbarBottom ? e.css("bottom", b.$tb.height() - d.position().top) : e.css("top", d.position().top + d.outerHeight())
			}
			d.addClass("fr-blink").toggleClass("fr-active"), setTimeout(function() {
				d.removeClass("fr-blink")
			}, 300);
			var i = e.get(0).ownerDocument,
				j = "defaultView" in i ? i.defaultView : i.parentWindow;
			e.offset().left + e.outerWidth() > jq(j).width() && e.css("margin-left", -(e.offset().left + e.outerWidth() - jq(j).width())), g.removeClass("fr-active")
		}
		function exec(c) {
			c.addClass("fr-blink"), setTimeout(function() {
				c.removeClass("fr-blink")
			}, 500);
			for (var d = c.data("cmd"), e = [];
			"undefined" != typeof c.data("param" + (e.length + 1));) e.push(c.data("param" + (e.length + 1)));
			var f = jq(".fr-dropdown.fr-active");
			f.length && f.removeClass("fr-active"), b.commands.exec(d, e)
		}
		function e(b) {
			var c = jq(b.currentTarget);
			exec(c)
		}
		function f(d) {
			var f = jq(d.currentTarget);
			0 != f.parents(".fr-popup").length || f.data("popup") || b.popups.hideAll(), f.hasClass("fr-dropdown") ? c(d) : (e(d), jq.FroalaEditor.COMMANDS[f.data("cmd")] && 0 != jq.FroalaEditor.COMMANDS[f.data("cmd")].refreshAfterCallback && bulkRefresh())
		}
		function g(a) {
			var b = a.find(".fr-dropdown.fr-active");
			b.length && b.removeClass("fr-active")
		}
		function h(a) {
			a.preventDefault(), a.stopPropagation()
		}
		function i(a) {
			a.stopPropagation()
		}
		function bindCommands(c, d) {
			b.events.bindClick(c, ".fr-command:not(.fr-disabled)", f), c.on(b._mousedown + " " + b._mouseup + " " + b._move, ".fr-dropdown-menu", h), c.on(b._mousedown + " " + b._mouseup + " " + b._move, ".fr-dropdown-menu .fr-dropdown-wrapper", i);
			var e = c.get(0).ownerDocument,
				j = "defaultView" in e ? e.defaultView : e.parentWindow,
				k = function(d) {
					(!d || "mouseup" == d.type && d.target != jq("html").get(0) || "keydown" == d.type && (b.keys.isCharacter(d.which) && !b.keys.ctrlKey(d) || d.which == jq.FroalaEditor.KEYCODE.ESC)) && g(c)
				};
			
			jq(j).on(b._mouseup + ".command" + b.id + " resize.command" + b.id + " keydown.command" + b.id, k), jq.merge(q, c.find(".fr-btn").toArray()), b.tooltip.bind(c, ".fr-btn", d), b.events.on("destroy", function() {
				c.off(b._mousedown + " " + b._mouseup + " " + b._move, ".fr-dropdown-menu"), c.on(b._mousedown + " " + b._mouseup + " " + b._move, ".fr-dropdown-menu .fr-dropdown-wrapper"), jq(j).off(b._mouseup + ".command" + b.id + " resize.command" + b.id + " keydown.command" + b.id)
			}, true)
		}
		function k(a, c) {
			var d = "";
			if (c.html) d += "function" == typeof c.html ? c.html.call(b) : c.html;
			else {
				var e = c.options;
				"function" == typeof e && (e = e()), d += '<ul class="fr-dropdown-list">';
				for (var f in e) d += '<li><a class="fr-command" data-cmd="' + a + '" data-param1="' + f + '" title="' + e[f] + '">' + b.language.translate(e[f]) + "</a></li>";
				d += "</ul>"
			}
			return d
		}
		function l(a, c) {
			var d = c.displaySelection;
			"function" == typeof d && (d = d(b));
			var e;
			e = d ? '<span style="width:' + (c.displaySelectionWidth || 100) + 'px">' + (c.defaultSelection || b.language.translate(c.title)) + "</span>" : b.icon.create(c.icon || a);
			var f = c.popup ? ' data-popup="true"' : "",
				g = '<a role="button" tabindex="-1" title="' + b.language.translate(c.title) + '" class="fr-command fr-btn' + ("dropdown" == c.type ? " fr-dropdown" : "") + (c.back ? " fr-back" : "") + '" data-cmd="' + a + '"' + f + ">" + e + "</a>";
			if ("dropdown" == c.type) {
				var h = '<div class="fr-dropdown-menu"><div class="fr-dropdown-wrapper"><div class="fr-dropdown-content" tabindex="-1">';
				h += k(a, c), h += "</div></div></div>", g += h
			}
			return g
		}
		function buildList(b) {
			for (var c = "", d = 0; d < b.length; d++) {
				var e = b[d],
					f = jq.FroalaEditor.COMMANDS[e];
				f ? c += l(e, f) : "|" == e ? c += '<div class="fr-separator fr-vs"></div>' : "-" == e && (c += '<div class="fr-separator fr-hs"></div>')
			}
			return c
		}
		function refresh(c) {
			var d, e = c.data("cmd");
			c.hasClass("fr-dropdown") ? d = c.next() : c.removeClass("fr-active"), jq.FroalaEditor.COMMANDS[e] && jq.FroalaEditor.COMMANDS[e].refresh ? jq.FroalaEditor.COMMANDS[e].refresh.apply(b, [c, d]) : b.refresh[e] ? b.refresh[e](c, d) : b.refresh["default"](c, e)
		}
		function bulkRefresh() {
			return 0 == b.events.trigger("buttons.refresh") ? false : void setTimeout(function() {
				for (var c = b.selection.inEditor() && b.core.hasFocus(), d = 0; d < q.length; d++) {
					var e = jq(q[d]),
						f = e.data("cmd");
					0 == e.parents(".fr-popup").length ? c || jq.FroalaEditor.COMMANDS[f] && jq.FroalaEditor.COMMANDS[f].forcedRefresh ? refresh(e) : e.hasClass("fr-dropdown") || e.removeClass("fr-active") : e.parents(".fr-popup").is(":visible") && refresh(e)
				}
			}, 0)
		}
		function p() {
			b.events.on("mouseup", bulkRefresh), b.events.on("keyup", bulkRefresh), b.events.on("blur", bulkRefresh), b.events.on("focus", bulkRefresh), b.events.on("contentChanged", bulkRefresh)
		}
		var q = [];
		return {
			require: ["events", "icon", "language"],
			_init: p,
			buildList: buildList,
			bindCommands: bindCommands,
			refresh: refresh,
			bulkRefresh: bulkRefresh,
			exec: exec
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.ICON_DEFAULT_TEMPLATE = "font_awesome", jq.FroalaEditor.ICON_TEMPLATES = {
		font_awesome: '<i class="fa fa-[NAME]"></i>',
		text: '<span style="text-align: center;">[NAME]</span>',
		image: "<img src=[SRC] alt=[ALT] />"
	}, jq.FroalaEditor.ICONS = {
		bold: {
			NAME: "bold"
		},
		
		italic: {
			NAME: "italic"
		},
		
		underline: {
			NAME: "underline"
		},
		
		strikeThrough: {
			NAME: "strikethrough"
		},
		
		subscript: {
			NAME: "subscript"
		},
		
		superscript: {
			NAME: "superscript"
		},
		
		color: {
			NAME: "tint"
		},
		
		outdent: {
			NAME: "outdent"
		},
		
		indent: {
			NAME: "indent"
		},
		
		undo: {
			NAME: "rotate-left"
		},
		
		redo: {
			NAME: "rotate-right"
		},
		
		insertHR: {
			NAME: "minus"
		},
		
		clearFormatting: {
			NAME: "eraser"
		},
		
		selectAll: {
			NAME: "mouse-pointer"
		}
	}, jq.FroalaEditor.DefineIconTemplate = function(b, c) {
		jq.FroalaEditor.ICON_TEMPLATES[b] = c
	}, jq.FroalaEditor.DefineIcon = function(b, c) {
		jq.FroalaEditor.ICONS[b] = c
	}, jq.FroalaEditor.MODULES.icon = function(b) {
		function create(b) {
			var c = null,
				d = jq.FroalaEditor.ICONS[b];
			if ("undefined" != typeof d) {
				var e = d.template || jq.FroalaEditor.ICON_DEFAULT_TEMPLATE;
				e && (e = jq.FroalaEditor.ICON_TEMPLATES[e]) && (c = e.replace(/\[([a-zA-Z]*)\]/g, function(a, c) {
					return "NAME" == c ? d[c] || b : d[c]
				}))
			}
			return c || b
		}
		return {
			require: ["events"],
			create: create
		}
	}
}(jQuery), 

function(jq) {
	"use strict";
	jq.FroalaEditor.POPUP_TEMPLATES = {
		"text.edit": "[_EDIT_]"
	}, jq.FroalaEditor.RegisterTemplate = function(b, c) {
		jq.FroalaEditor.POPUP_TEMPLATES[b] = c
	}, jq.FroalaEditor.MODULES.popups = function(b) {
		function setContainer(a, b) {
			t[a].data("container", b), b.append(t[a])
		}
		function show(d, e, g, h) {
			hideAll([d]);
			var i = t[d].outerWidth(),
				j = (t[d].outerHeight(), isVisible(d));
			t[d].addClass("fr-active");
			var k = t[d].data("container");
			b.opts.toolbarInline && k && b.$tb && k.get(0) == b.$tb.get(0) && (setContainer(d, b.opts.toolbarInline ? jq(b.opts.scrollableContainer) : b.$box), g && (g = b.$tb.offset().top - b.helpers.getPX(b.$tb.css("margin-top"))), e && (e = b.$tb.offset().left + b.$tb.width() / 2), b.$tb.hasClass("fr-above") && (g += b.$tb.outerHeight()), h = 0), k = t[d].data("container"), !b.opts.iframe || h || j || (e && (e -= b.$iframe.offset().left), g && (g -= b.$iframe.offset().top)), e && (e -= i / 2), b.opts.toolbarBottom && k && b.$tb && k.get(0) == b.$tb.get(0) && (t[d].addClass("fr-above"), g -= t[d].outerHeight()), b.position.at(e, g, t[d], h || 0);
			var l = t[d].find("input:visible, textarea:visible").get(0);
			l && (b.events.disableBlur(), jq(l).select().focus()), b.opts.toolbarInline && !b.helpers.isMobile() && b.toolbar.hide(), b.events.trigger("popups.show." + d)
		}
		function onShow(a, c) {
			b.events.on("popups.show." + a, c)
		}
		function isVisible(a) {
			return t[a] && t[a].hasClass("fr-active") || false
		}
		function areVisible() {
			for (var a in t) if (isVisible(a)) return true;
			return false
		}
		function hide(a) {
			t[a] && t[a].hasClass("fr-active") && (b.events.trigger("popups.hide." + a), t[a].removeClass("fr-active fr-above"), b.events.disableBlur(), t[a].find("input, textarea, button, checkbox").filter(":focus").blur())
		}
		function onHide(a, c) {
			b.events.on("popups.hide." + a, c)
		}
		function get(a) {
			return t[a]
		}
		function onRefresh(a, c) {
			b.events.on("popups.refresh." + a, c)
		}
		function refresh(c) {
			b.events.trigger("popups.refresh." + c);
			for (var d = t[c].find(".fr-command"), e = 0; e < d.length; e++) {
				var f = jq(d[e]);
				0 == f.parents(".fr-dropdown-menu").length && b.button.refresh(f)
			}
		}
		function hideAll(a) {
			"undefined" == typeof a && (a = []);
			for (var b in t) a.indexOf(b) < 0 && hide(b)
		}
		function n() {
			u = true
		}
		function o() {
			u = false
		}
		function p(c, d) {
			var e = jq.FroalaEditor.POPUP_TEMPLATES[c];
			"function" == typeof e && (e = e.apply(b));
			for (var f in d) e = e.replace("[_" + f.toUpperCase() + "_]", d[f]);
			return e
		}
		function create(c, d) {
			var e = p(c, d),
				g = jq('<div class="fr-popup' + (b.helpers.isMobile() ? " fr-mobile" : " fr-desktop") + (b.opts.toolbarInline ? " fr-inline" : "") + '">' + e + "</div>");
			b.opts.theme && g.addClass(b.opts.theme + "-theme"), b.opts.zIndex > 1 && b.$tb.css("z-index", b.opts.zIndex + 2), "auto" != b.opts.direction && g.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), g.find("input, textarea").attr("dir", b.opts.direction);
			var i = jq("body");
			return i.append(g), g.data("container", i), t[c] = g, b.button.bindCommands(g, false), jq(b.original_window).on("resize.popups" + b.id, function() {
				b.helpers.isMobile() || (b.events.disableBlur(), hide(c), b.events.enableBlur())
			}), g.on(b._mousedown + " " + b._mouseup, function(a) {
				var b = a.originalEvent ? a.originalEvent.target || a.originalEvent.originalTarget : null;
				return b && "INPUT" != b.tagName ? (a.preventDefault(), a.stopPropagation(), false) : void a.stopPropagation()
			}), g.on("focus", "input, textarea, button, select", function(c) {
				if (c.preventDefault(), c.stopPropagation(), setTimeout(function() {
					b.events.enableBlur()
				}, 0), b.helpers.isMobile()) {
					var d = jq(b.original_window).scrollTop();
					
					setTimeout(function() {
						jq(b.original_window).scrollTop(d)
					}, 0)
				}
			}), g.on("keydown", "input, textarea, button, select", function(d) {
				var e = d.which;
				if (jq.FroalaEditor.KEYCODE.TAB == e) {
					d.preventDefault();
					
					var i = g.find("input, textarea, button, select").filter(":visible").not(":disabled").toArray();
					
					i.sort(function(b, c) {
						return d.shiftKey ? jq(b).attr("tabIndex") < jq(c).attr("tabIndex") : jq(b).attr("tabIndex") > jq(c).attr("tabIndex")
					}), b.events.disableBlur();
					
					var j = i.indexOf(this) + 1;
					j == i.length && (j = 0), jq(i[j]).focus()
				}
				if (jq.FroalaEditor.KEYCODE.ENTER == e) 
					g.find(".fr-submit:visible").length > 0 && (d.preventDefault(), d.stopPropagation(), b.events.disableBlur(), b.button.exec(g.find(".fr-submit:visible:first")));
				else {
					if (jq.FroalaEditor.KEYCODE.ESC == e) return d.preventDefault(), d.stopPropagation(), b.$el.find(".fr-marker") && (b.events.disableBlur(), jq(this).data("skip", true), b.events.focus(), b.selection.restore(), b.events.enableBlur()), isVisible(c) && g.find(".fr-back:visible").length ? b.button.exec(g.find(".fr-back:visible:first")) : hide(c), b.opts.toolbarInline && b.toolbar.showInline(null, true), false;
					d.stopPropagation()
				}
			}), b.events.on("window.keydown", function(d) {
				var e = d.which;
				if (jq.FroalaEditor.KEYCODE.ESC == e) {
					if (isVisible(c) && b.opts.toolbarInline) return d.stopPropagation(), isVisible(c) && g.find(".fr-back:visible").length ? b.button.exec(g.find(".fr-back:visible:first")) : (hide(c), b.toolbar.showInline(null, true)), false;
					isVisible(c) && g.find(".fr-back:visible").length ? b.button.exec(g.find(".fr-back:visible:first")) : hide(c)
				}
			}), b.$wp && (b.events.on("keydown", function(d) {
				b.keys.ctrlKey(d) || d.which == jq.FroalaEditor.KEYCODE.ESC || (isVisible(c) && g.find(".fr-back:visible").length ? b.button.exec(g.find(".fr-back:visible:first")) : hide(c))
			}), g.on("blur", "input, textarea, button, select", function(c) {
				document.activeElement != this && jq(this).is(":visible") && (b.events.blurActive() && b.events.trigger("blur"), b.events.enableBlur())
			})), g.on("mousedown touchstart touch", "*", function(a) {
				["INPUT", "TEXTAREA", "BUTTON", "SELECT", "LABEL"].indexOf(a.currentTarget.tagName) >= 0 && a.stopPropagation(), b.events.disableBlur()
			}), b.events.on("mouseup", function(a) {
				g.is(":visible") && u && g.find("input:focus, textarea:focus, button:focus, select:focus").filter(":visible").length > 0 && b.events.disableBlur()
			}, true), b.events.on("window.mouseup", function(a) {
				g.is(":visible") && u && (a.stopPropagation(), b.markers.remove(), hide(c))
			}, true), b.events.on("blur", function(a) {
				hideAll()
			}), g.on("keydown keyup change input", "input, textarea", function(b) {
				var c = jq(this).next();
				
				0 == c.length && jq(this).after("<span>" + jq(this).attr("placeholder") + "</span>"), jq(this).toggleClass("fr-not-empty", "" != jq(this).val())
			}), b.$wp && !b.helpers.isMobile() && b.$wp.on("scroll.popup" + c, function(d) {
				if (isVisible(c) && g.parent().get(0) == jq(b.opts.scrollableContainer).get(0)) {
					var e = g.offset().top - b.$wp.offset().top,
						h = (b.$wp.scrollTop(), b.$wp.outerHeight());
					e > h || 0 > e ? g.addClass("fr-hidden") : g.removeClass("fr-hidden")
				}
			}), b.helpers.isIOS() && g.on("touchend", "label", function() {
				jq("#" + jq(this).attr("for")).prop("checked", function(a, b) {
					return !b
				})
			}), g
		}
		function r() {
			for (var c in t) {
				var d = t[c];
				d.off("mousedown mouseup touchstart touchend"), d.off("focus", "input, textarea, button, select"), d.off("keydown", "input, textarea, button, select"), d.off("blur", "input, textarea, button, select"), d.off("keydown keyup change", "input, textarea"), d.off(b._mousedown, "*"), d.html("").removeData().remove(), jq(b.original_window).off("resize.popups" + b.id), b.$wp && b.$wp.off("scroll.popup" + c)
			}
		}
		function underscoreInit() {
			b.events.on("destroy", r, true), b.events.on("window.mousedown", n), b.events.on("window.touchmove", o), b.events.on("window.mouseup", function() {
				u = false
			})
		}
		var t = {},
			u = false;
		return {
			require: ["events", "commands", "language"],
			_init: underscoreInit,
			create: create,
			get: get,
			show: show,
			hide: hide,
			onHide: onHide,
			hideAll: hideAll,
			setContainer: setContainer,
			refresh: refresh,
			onRefresh: onRefresh,
			onShow: onShow,
			isVisible: isVisible,
			areVisible: areVisible
		}
	}
}(jQuery), 


function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.position = function(b) {
		function c() {
			var c, d = b.selection.ranges(0);
			if (d && d.collapsed && b.selection.inEditor()) {
				var e = false;
				0 == b.$el.find(".fr-marker").length && (b.markers.insert(), e = true);
				var f = b.$el.find(".fr-marker:first");
				f.css("display", "inline");
				var g = f.offset();
				
				f.css("display", "none"), c = {}, c.left = g.left, c.width = 0, c.height = parseInt(f.css("line-height"), 10) || 20, c.top = g.top - jq(b.original_window).scrollTop(), c.right = 1, c.bottom = 1, c.ok = true, e && b.markers.remove()
			} else d && (c = d.getBoundingClientRect());
			return c
		}
		function d(c, d, e) {
			var f = c.outerHeight();
			
			if (!b.helpers.isMobile() && b.$tb && c.parent().get(0) != b.$tb.get(0)) {
				var g = (c.parent().height() - 20 - (b.opts.toolbarBottom ? b.$tb.outerHeight() : 0), c.parent().offset().top),
					h = d - f - (e || 0);
				c.parent().get(0) == jq(b.opts.scrollableContainer).get(0) && (g -= c.parent().position().top), g + d + f > jq(b.original_document).outerHeight() && c.parent().offset().top + h > 0 ? (d = h, c.addClass("fr-above")) : c.removeClass("fr-above")
			}
			return d
		}
		function e(c, d) {
			var e = c.outerWidth();
			
			return c.parent().offset().left + d + e > jq(b.opts.scrollableContainer).width() - 10 && (d = jq(b.opts.scrollableContainer).width() - e - 10 - c.parent().offset().left + jq(b.opts.scrollableContainer).offset().left), c.parent().offset().left + d < jq(b.opts.scrollableContainer).offset().left && (d = 10 - c.parent().offset().left + jq(b.opts.scrollableContainer).offset().left), d
		}
		function f(d) {
			var e = c();
			
			d.css("top", 0).css("left", 0);
			var f = e.top + e.height,
				h = e.left + e.width / 2 - d.outerWidth() / 2 + jq(b.original_window).scrollLeft();
			
			b.opts.iframe || (f += jq(b.original_window).scrollTop()), g(h, f, d, e.height)
		}
		function g(a, c, f, g) {
			var h = f.data("container");
			h && "BODY" != h.get(0).tagName && (a && (a -= h.offset().left), c && (c -= h.offset().top - h.scrollTop())), b.opts.iframe && h && b.$tb && h.get(0) != b.$tb.get(0) && (a && (a += b.$iframe.offset().left), c && (c += b.$iframe.offset().top)), a && f.css("left", e(f, a)), c && f.css("top", d(f, c, g))
		}
		function h(c) {
			var d = jq(c),
				e = d.parent(),
				f = d.is(".fr-sticky-on"),
				g = d.data("sticky-top"),
				h = d.data("sticky-scheduled");
			if ("undefined" == typeof g && (d.data("sticky-top", 0), d.after('<div class="fr-sticky-dummy" style="height: ' + d.outerHeight() + 'px;"></div>'), d.data("sticky-dummy", d.next())), b.core.hasFocus() || b.$tb.find("input:visible:focus").length > 0) {
				var i = jq(window).scrollTop(),
					j = Math.min(Math.max(i - e.offset().top, 0), e.outerHeight() - d.outerHeight());
				j != g && j != h && (clearTimeout(d.data("sticky-timeout")), d.data("sticky-scheduled", j), d.outerHeight() < i - e.offset().top && d.addClass("fr-opacity-0"), d.data("sticky-timeout", setTimeout(function() {
					var c = jq(window).scrollTop(),
						f = Math.min(Math.max(c - e.offset().top, 0), e.outerHeight() - d.outerHeight());
					f > 0 && "BODY" == e.get(0).tagName && (f += e.position().top), f != g && (d.css("top", Math.max(f, 0)), d.data("sticky-top", f), d.data("sticky-scheduled", f)), d.removeClass("fr-opacity-0"), b.$tb.hasClass("fr-inline") && b.toolbar.show()
				}, 100))), f || (d.css("top", ""), d.width(e.width()), d.addClass("fr-sticky-on"))
			} else clearTimeout(jq(c).css("sticky-timeout")), d.css("top", ""), d.css("position", ""), d.width(""), d.data("sticky-top", 0), d.removeClass("fr-sticky-on"), b.$tb.hasClass("fr-inline") && b.toolbar.hide()
		}
		function i(c) {
			if (c.offsetWidth) {
				var d, e, f = jq(c),
					g = f.outerHeight(),
					h = f.data("sticky-offset"),
					i = f.data("sticky-position"),
					j = jq(b.original_window).scrollTop(),
					k = jq(b.original_window).height(),
					l = f.is(".fr-sticky-on"),
					m = f.parent(),
					n = m.offset().top,
					o = m.outerHeight();
				
				if (!i) {
					var p = "auto" !== f.css("top") || "auto" !== f.css("bottom");
					p || f.css("position", "fixed"), i = {
						top: "auto" !== f.css("top"),
						bottom: "auto" !== f.css("bottom")
					}, p || f.css("position", ""), f.data("sticky-position", i), f.data("top", f.css("top")), f.data("bottom", f.css("bottom"))
				}
				"undefined" == typeof h && (h = f.offset().top - b.helpers.getPX(f.css("top")) + b.helpers.getPX(f.css("bottom")), f.data("sticky-offset", h), f.after('<div class="fr-sticky-dummy" style="height: ' + g + 'px;"></div>'));
				var q = function() {
					var a = j + d;
					return a > h && n + o >= a + g
				},
					r = function() {
						return h + (g || 0) > j + k - e && j + k - e >= n + (g || 0)
					};
				
				d = b.helpers.getPX(f.data("top")), e = b.helpers.getPX(f.data("bottom"));
				var s = i.top && q(),
					t = i.bottom && r();
				
				s || t ? (f.css("width", m.width() + "px"), l || (f.addClass("fr-sticky-on"), f.removeClass("fr-sticky-off"), f.css("top") && f.css("top", f.data("top")), f.css("bottom") && f.css("bottom", f.data("bottom")))) : f.hasClass("fr-sticky-off") || (f.width(""), f.removeClass("fr-sticky-on"), f.addClass("fr-sticky-off"), f.css("top") && f.css("top", 0), f.css("bottom") && f.css("bottom", 0))
			}
		}
		function j() {
			var a = document.createElement("test"),
				c = a.style;
			return c.cssText = "position:" + ["-webkit-", "-moz-", "-ms-", "-o-", ""].join("sticky; position:") + " sticky;", -1 !== c.position.indexOf("sticky") && !b.helpers.isIOS() && !b.helpers.isAndroid()
		}
		function k() {
			if (!j()) if (b._stickyElements = [], b.helpers.isIOS()) {
				var c = function() {
					b.helpers.requestAnimationFrame()(c);
					for (var a = 0; a < b._stickyElements.length; a++) h(b._stickyElements[a])
				};
				
				c(), jq(b.original_window).on("scroll.sticky" + b.id, function() {
					if (b.core.hasFocus()) for (var c = 0; c < b._stickyElements.length; c++) {
						var d = jq(b._stickyElements[c]),
							e = d.parent(),
							f = jq(window).scrollTop();
						
						d.outerHeight() < f - e.offset().top && (d.addClass("fr-opacity-0"), d.data("sticky-top", -1), d.data("sticky-scheduled", -1))
					}
				})
			} else {
				var d = function() {
					m();
					
					for (var a = 0; a < b._stickyElements.length; a++) i(b._stickyElements[a])
				};
				
				jq(b.original_window).on("scroll.sticky" + b.id, d), jq(b.original_window).on("resize.sticky" + b.id, d), b.events.on("initialized", d), b.events.on("focus", d), jq(b.original_window).on("resize", "textarea", m)
			}
		}
		function l(a) {
			a.addClass("fr-sticky"), b.helpers.isIOS() && a.addClass("fr-sticky-ios"), j() || b._stickyElements.push(a.get(0))
		}
		function m() {
			if (!j() && !b.helpers.isIOS()) for (var c = 0; c < b._stickyElements.length; c++) {
				var d = jq(b._stickyElements[c]);
				d.removeClass("fr-sticky-on fr-sticky-off"), d.width(""), d.parent().find(".fr-sticky-dummy").remove(), d.removeData("sticky-offset"), d.removeData("sticky-position"), d.css("top") && d.css("top", d.data("top")), d.css("bottom") && d.css("bottom", d.data("bottom")), d.removeData("top"), d.removeData("bottom")
			}
		}
		function n() {
			jq(b.original_window).off("scroll.sticky" + b.id), jq(b.original_window).off("resize.sticky" + b.id)
		}
		function o() {
			k(), b.events.on("destroy", n, true)
		}
		return {
			require: ["events"],
			_init: o,
			refresh: m,
			forSelection: f,
			addSticky: l,
			at: g,
			getBoundingRect: c
		}
	}
}(jQuery), 


function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.refresh = function(b) {
		function c(a, c) {
			try {
				b.document.queryCommandState(c) === true && a.addClass("fr-active")
			} catch (d) {}
		}
		function d(a) {
			a.toggleClass("fr-disabled", !b.undo.canDo())
		}
		function e(a) {
			a.toggleClass("fr-disabled", !b.undo.canRedo())
		}
		function f(a) {
			for (var c = b.selection.blocks(), d = 0; d < c.length; d++) {
				if ("LI" != c[d].tagName || c[d].previousSibling) return a.removeClass("fr-disabled"), true;
				a.addClass("fr-disabled")
			}
		}
		function g(c) {
			for (var d = "rtl" == b.opts.direction ? "margin-right" : "margin-left", e = b.selection.blocks(), f = 0; f < e.length; f++) {
				if ("LI" == e[f].tagName || "LI" == e[f].parentNode.tagName) return c.removeClass("fr-disabled"), true;
				if (b.helpers.getPX(jq(e[f]).css(d)) > 0) return c.removeClass("fr-disabled"), true
			}
			c.addClass("fr-disabled")
		}
		return {
			require: ["events"],
			"default": c,
			undo: d,
			redo: e,
			outdent: g,
			indent: f
		}
	}
}(jQuery), 


function(jq) {
	"use strict";
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		editInPopup: false
	}), jq.FroalaEditor.MODULES.textEdit = function(b) {
		function c() {
			var a = '<div id="fr-text-edit-' + b.id + '" class="fr-layer fr-text-edit-layer"><div class="fr-input-line"><input type="text" placeholder="' + b.language.translate("Text") + '" tabIndex="1"></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="updateText" tabIndex="2">' + b.language.translate("Update") + "</button></div></div>",
				c = {
					edit: a
				};
			
			b.popups.create("text.edit", c)
		}
		function d() {
			var c = b.popups.get("text.edit");
			c.find("input").val(b.$el.text()).trigger("change"), b.popups.setContainer("text.edit", jq("body")), b.popups.show("text.edit", b.$el.offset().left + b.$el.outerWidth() / 2, b.$el.offset().top + b.$el.outerHeight(), b.$el.outerHeight())
		}
		function e() {
			b.$el.on(b._mouseup, function(a) {
				setTimeout(function() {
					d()
				}, 10)
			})
		}
		function f() {
			var a = b.popups.get("text.edit");
			b.$el.text(a.find("input").val()), b.events.trigger("contentChanged"), d()
		}
		function g() {
			b.opts.editInPopup && (c(), e())
		}
		return {
			require: ["popups"],
			_init: g,
			update: f
		}
	}, jq.FroalaEditor.RegisterCommand("updateText", {
		focus: false,
		undo: false,
		callback: function() {
			this.textEdit.update()
		}
	})
}(jQuery), 


function(jq) {
	"use strict";
	jq.extend(jq.FroalaEditor.DEFAULTS, {
		toolbarInline: false,
		toolbarVisibleWithoutSelection: false,
		toolbarSticky: true,
		toolbarButtons: ["fullscreen", "bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "fontFamily", "fontSize", "|", "color", "emoticons", "inlineStyle", "paragraphStyle", "|", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "-", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting", "selectAll", "html"],
		toolbarButtonsXS: ["bold", "italic", "fontFamily", "fontSize", "undo", "redo"],
		toolbarButtonsSM: ["fullscreen", "bold", "italic", "underline", "fontFamily", "fontSize", "insertLink", "insertImage", "table", "undo", "redo"],
		toolbarButtonsMD: ["fullscreen", "bold", "italic", "underline", "fontFamily", "fontSize", "color", "paragraphStyle", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting", "-", "|"],
		toolbarStickyOffset: 0
	}), jq.FroalaEditor.MODULES.toolbar = function(b) {
		function c() {
			var a = b.button.buildList(b.opts.toolbarButtons);
			b.$tb.append(a), b.button.bindCommands(b.$tb)
		}
		function d() {
			b.$tb.find("> .fr-command").each(function(c, d) {
				b.opts.toolbarButtonsXS.indexOf(jq(d).data("cmd")) >= 0 && jq(d).addClass("fr-visible-xs"), b.opts.toolbarButtonsSM.indexOf(jq(d).data("cmd")) >= 0 && jq(d).addClass("fr-visible-sm"), b.opts.toolbarButtonsMD.indexOf(jq(d).data("cmd")) >= 0 && jq(d).addClass("fr-visible-md")
			}), b.opts.toolbarButtonsXS.indexOf("-") >= 0 && b.$tb.find(".fr-separator.fr-hs").addClass("fr-visible-xs"), b.opts.toolbarButtonsSM.indexOf("-") >= 0 && b.$tb.find(".fr-separator.fr-hs").addClass("fr-visible-sm"), b.opts.toolbarButtonsMD.indexOf("-") >= 0 && b.$tb.find(".fr-separator.fr-hs").addClass("fr-visible-md"), b.opts.toolbarButtonsXS.indexOf("|") >= 0 && b.$tb.find(".fr-separator.fr-vs").addClass("fr-visible-xs"), b.opts.toolbarButtonsSM.indexOf("|") >= 0 && b.$tb.find(".fr-separator.fr-vs").addClass("fr-visible-sm"), b.opts.toolbarButtonsMD.indexOf("|") >= 0 && b.$tb.find(".fr-separator.fr-vs").addClass("fr-visible-md")
		}
		function e(c, d) {
			b.helpers.isMobile() ? b.toolbar.show() : setTimeout(function() {
				if (c && c.which == jq.FroalaEditor.KEYCODE.ESC);
				else if (b.selection.inEditor() && b.core.hasFocus() && !b.popups.areVisible() && (b.opts.toolbarVisibleWithoutSelection || "" !== b.selection.text() || d)) {
					if (0 == b.events.trigger("toolbar.show")) return false;
					b.helpers.isMobile() || b.position.forSelection(b.$tb), b.$tb.show()
				}
			}, 0)
		}
		function f() {
			return 0 == b.events.trigger("toolbar.hide") ? false : void b.$tb.hide()
		}
		function g() {
			return 0 == b.events.trigger("toolbar.show") ? false : void b.$tb.show()
		}
		function h() {
			b.events.on("window.mousedown", f), b.events.on("keydown", f), b.events.on("blur", f), b.events.on("window.mouseup", e), b.events.on("keyup", e), b.events.on("keydown", function(b) {
				b && b.which == jq.FroalaEditor.KEYCODE.ESC && f()
			}), b.$wp.on("scroll.toolbar", e), b.events.on("commands.after", e)
		}
		function i() {
			b.events.on("focus", e, true), b.events.on("blur", f, true)
		}
		function j() {
			b.opts.toolbarInline ? (b.$box.addClass("fr-inline"), b.helpers.isMobile() ? (b.helpers.isIOS() ? (jq("body").append(b.$tb), b.position.addSticky(b.$tb)) : (b.$tb.addClass("fr-bottom"), b.$box.append(b.$tb), b.position.addSticky(b.$tb), b.opts.toolbarBottom = true), b.$tb.addClass("fr-inline"), i(), b.opts.toolbarInline = false) : (jq(b.opts.scrollableContainer).append(b.$tb), b.$tb.data("container", jq(b.opts.scrollableContainer)), b.$tb.addClass("fr-inline"), h(), b.opts.toolbarBottom = false)) : (b.opts.toolbarBottom && !b.helpers.isIOS() ? (b.$box.append(b.$tb), b.$tb.addClass("fr-bottom"), b.$box.addClass("fr-bottom")) : (b.opts.toolbarBottom = false, b.$box.prepend(b.$tb), b.$tb.addClass("fr-top"), b.$box.addClass("fr-top")), b.$box.addClass("fr-basic"), b.$tb.addClass("fr-basic"), b.opts.toolbarSticky && (b.opts.toolbarStickyOffset && (b.opts.toolbarBottom ? b.$tb.css("bottom", b.opts.toolbarStickyOffset) : b.$tb.css("top", b.opts.toolbarStickyOffset)), b.position.addSticky(b.$tb)))
		}
		function k() {
			b.$box.removeClass("fr-top fr-bottom fr-inline fr-basic"), b.$box.find(".fr-sticky-dummy").remove(), b.$tb.off(b._mousedown + " " + b._mouseup), b.$tb.html("").removeData().remove()
		}
		function l() {
			return b.$wp ? (b.$tb = jq('<div class="fr-toolbar"></div>'), b.opts.theme && b.$tb.addClass(b.opts.theme + "-theme"), b.opts.zIndex > 1 && b.$tb.css("z-index", b.opts.zIndex + 1), "auto" != b.opts.direction && b.$tb.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), b.helpers.isMobile() ? b.$tb.addClass("fr-mobile") : b.$tb.addClass("fr-desktop"), j(), o = b.$tb.get(0).ownerDocument, p = "defaultView" in o ? o.defaultView : o.parentWindow, c(), d(), b.$tb.on(b._mousedown + " " + b._mouseup, function(a) {
				var b = a.originalEvent ? a.originalEvent.target || a.originalEvent.originalTarget : null;
				return b && "INPUT" != b.tagName ? (a.stopPropagation(), a.preventDefault(), false) : void 0
			}), void b.events.on("destroy", k, true)) : false
		}
		function m() {
			!q && b.$tb && (b.$tb.find("> .fr-command").addClass("fr-disabled"), q = true)
		}
		function n() {
			q && b.$tb && (b.$tb.find("> .fr-command").removeClass("fr-disabled"), q = false), b.button.bulkRefresh()
		}
		var o, p, q = false;
		return {
			require: ["events", "tooltip", "button", "icon", "core", "language"],
			_init: l,
			hide: f,
			show: g,
			showInline: e,
			disable: m,
			enable: n
		}
	}
}(jQuery), 


function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.tooltip = function(b) {
		function c() {
			b.$tooltip.removeClass("fr-visible").css("left", "-3000px")
		}
		function d(a, c) {
			a.data("title") || a.data("title", a.attr("title")), a.removeAttr("title"), b.$tooltip.text(a.data("title")), b.$tooltip.addClass("fr-visible"), b.$tooltip.css("left", a.offset().left + (a.outerWidth() - b.$tooltip.outerWidth()) / 2), "undefined" == typeof c && (c = b.opts.toolbarBottom), b.$tooltip.css("top", c ? a.offset().top - b.$tooltip.height() : a.offset().top + a.outerHeight())
		}
		function e(e, f, g) {
			b.helpers.isMobile() || (e.on("mouseenter", f, function(b) {
				d(jq(b.currentTarget), g)
			}), e.on("mouseleave " + b._mousedown + " " + b._mouseup, f, function(a) {
				c()
			})), b.events.on("destroy", function() {
				e.off("mouseleave " + b._mousedown + " " + b._mouseup, f), e.off("mouseenter", f)
			}, true)
		}
		function f() {
			b.helpers.isMobile() || (b.$tooltip = jq('<div class="fr-tooltip"></div>'), b.opts.theme && b.$tooltip.addClass(b.opts.theme + "-theme"), jq("body").append(b.$tooltip), b.events.on("destroy", function() {
				b.$tooltip.html("").removeData().remove()
			}, true))
		}
		return {
			require: ["events", "language"],
			_init: f,
			hide: c,
			to: d,
			bind: e
		}
	}
}(jQuery), 


function(jq) {
	"use strict";
	jq.FroalaEditor.MODULES.undo = function(a) {
		function b(b) {
			var c = b.which,
				d = a.keys.ctrlKey(b);
			d && (90 == c && b.shiftKey && b.preventDefault(), 90 == c && b.preventDefault())
		}
		function canDo() {
			return 0 === a.undo_stack.length || a.undo_index <= 1 ? false : true
		}
		function canRedo() {
			return a.undo_index == a.undo_stack.length ? false : true
		}
		function saveStep(b) {
			if (!a.undo_stack || a.undoing) return false;
			for (; a.undo_stack.length > a.undo_index;) a.undo_stack.pop();
			"undefined" == typeof b ? (b = a.snapshot.get(), a.undo_stack[a.undo_index - 1] && a.snapshot.equal(a.undo_stack[a.undo_index - 1], b) || (a.undo_stack.push(b), a.undo_index++, b.html != j && (a.events.trigger("contentChanged"), j = b.html))) : a.undo_index > 0 ? a.undo_stack[a.undo_index - 1] = b : (a.undo_stack.push(b), a.undo_index++)
		}
		function run() {
			if (a.undo_index > 1) {
				a.undoing = true;
				var b = a.undo_stack[--a.undo_index - 1];
				clearTimeout(a._content_changed_timer), a.snapshot.restore(b), a.popups.hideAll(), a.toolbar.enable(), a.events.trigger("contentChanged"), a.events.trigger("commands.undo"), a.undoing = false
			}
		}
		function redo() {
			if (a.undo_index < a.undo_stack.length) {
				a.undoing = true;
				var b = a.undo_stack[a.undo_index++];
				clearTimeout(a._content_changed_timer), a.snapshot.restore(b), a.popups.hideAll(), a.toolbar.enable(), a.events.trigger("contentChanged"), a.events.trigger("commands.redo"), a.undoing = false
			}
		}
		function reset() {
			a.undo_index = 0, a.undo_stack = []
		}
		function underscore_init() {
			reset(), a.events.on("initialized", function() {
				j = a.html.get()
			}), a.events.on("keydown", b)
		}
		var j = null;
		return {
			require: ["snapshot", "events", "core"],
			_init: underscore_init,
			run: run,
			redo: redo,
			canDo: canDo,
			canRedo: canRedo,
			reset: reset,
			saveStep: saveStep
		}
	}
}(jQuery);