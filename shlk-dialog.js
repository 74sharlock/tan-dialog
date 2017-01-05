// Generated by CoffeeScript 1.12.2
(function() {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(function() {
        return factory();
      });
    } else if (typeof module !== 'undefined') {
      return module.exports = factory();
    } else {
      return root.lb = factory();
    }
  })(this, function() {
    var CE, D, Q, QA, Tan, _bindEvent, _fireEvent, animate, createMask, createNode, doc, errorTips, getType, infoTips, isFunction, now, primaryTips, sucTips, tan, tanAlert, tanConfirm, tanTips, toString, warnTips;
    doc = document;
    Q = doc.querySelector.bind(doc);
    D = doc.getElementById.bind(doc);
    QA = doc.querySelectorAll.bind(doc);
    CE = doc.createElement.bind(doc);
    toString = Object.prototype.toString;
    getType = function(everything) {
      return toString.call(everything).replace('[object ', '').replace(']', '').toLowerCase();
    };
    isFunction = function(fn) {
      return getType(fn) === 'function';
    };
    now = function() {
      return new Date().getTime();
    };
    _bindEvent = function(event, fn) {
      this.listeners = this.listeners || {};
      this.listeners[event] = this.listeners[event] || [];
      this.listeners[event].push(fn);
      return this;
    };
    _fireEvent = function(event) {
      var fn, i, len, ref;
      if (this.listeners) {
        ref = this.listeners[event];
        for (i = 0, len = ref.length; i < len; i++) {
          fn = ref[i];
          if (this.listeners[event] && isFunction(fn)) {
            fn.call(this);
          }
        }
      }
      return this;
    };
    createNode = function() {
      var b, btn, c, cancelVal, className, content, div, height, okVal, otherHeight, t, title, width;
      div = CE('div');
      className = this.config['skin'] ? ' ' + this.config['skin'] : '';
      div.className = 'tan-block hidden' + className;
      div.id = this.id;
      title = (this.config['title'] !== false ? '<div class="tan-title"><span>' + this.config['title'] + '</span><i class="close-this fa fa-close">X</i></div>' : '');
      content = this.config['content'] || '';
      okVal = this.config['okVal'] || '确定';
      cancelVal = this.config['cancelVal'] || '取消';
      btn = (this.config['ok'] !== false ? '<a class="btn btn-ok">' + okVal + '</a>' : '') + (this.config['cancel'] !== false ? '<a class="btn btn-cancel">' + cancelVal + '</a>' : '');
      div.innerHTML = title + '<div class="tan-content">' + content + '</div><div class="tan-btn-area">' + btn + '</div>';
      c = div.querySelector('.tan-content');
      t = div.querySelector('.tan-title');
      b = div.querySelector('.tan-btn-area');
      otherHeight = (t ? t.clientHeight : 0) + b.clientHeight;
      width = this.config['width'] ? parseInt(this.config['width'], 10) : 200;
      height = this.config['height'] ? parseInt(this.config['height'], 10) : 200;
      div.style.marginLeft = -(width / 2) + 'px';
      div.style.marginTop = -((height + otherHeight) / 2) + 'px';
      div.style.zIndex = this.config['zIndex'] || '1001';
      div.style.top = this.config['top'] || '25%';
      div.style.left = this.config['left'] || '50%';
      c.style.width = width + 'px';
      c.style.height = height + 'px';
      return div;
    };
    createMask = function() {
      var background, duration, mask, style;
      mask = CE('div');
      mask.id = 'tanMask';
      mask.className = 'tan-mask';
      background = this.config['maskBackground'] || 'rgba(0,0,0,.7)';
      duration = this.config['maskTransitionTime'] || '1s';
      style = '-webkit-transition: opacity ' + duration + ' ease-in-out;-webkit-transition: opacity ' + duration + ' ease-in-out;background:' + background;
      mask.setAttribute('style', style);
      return mask;
    };
    animate = function(opts) {
      var count, delay, direction, duration, h;
      h = function() {
        this.classList.remove('animated');
        this.classList.remove(opts.name);
        this.isAnimating = false;
        if (getType(opts.fn) === 'function') {
          opts.fn.call(this);
        }
        this.removeEventListener('webkitAnimationEnd', h, false);
        return this.removeEventListener('animationend', h, false);
      };
      this.addEventListener('webkitAnimationEnd', h, false);
      this.addEventListener('animationend', h, false);
      if (getType(opts.name) === 'string') {
        duration = opts.duration || 1;
        delay = getType(opts.delay) === 'number' ? opts.delay : 0;
        count = opts.count || 1;
        direction = opts.direction;
        if (!(getType(this.isAnimating) === 'boolean')) {
          this.isAnimating = false;
        }
        if (!this.isAnimating) {
          this.isAnimating = true;
          if (duration) {
            duration = duration + 's';
            this.style.animationDuration = duration;
            this.style.webkitAnimationDuration = duration;
          }
          if (delay) {
            delay = delay + 's';
            this.style.animationDelay = delay;
            this.style.webkitAnimationDelay = delay;
          }
          if (direction) {
            this.style.animationDirection = direction;
            this.style.webkitAnimationDirection = direction;
          }
          if (!(parseInt(count, 10) === 1)) {
            this.style.animationIterationCount = count;
            this.style.webkitAnimationIterationCount = count;
          }
          this.classList.add('animated');
          return this.classList.add(opts.name);
        }
      }
    };
    Tan = (function() {
      function Tan(config1) {
        this.config = config1;
        this.id = 'tan' + now();
        this.isOperating = false;
      }

      Tan.prototype.version = '0.1.0';

      Tan.prototype.show = function(needModal) {
        var self;
        if (getType(needModal) !== 'boolean') {
          needModal = true;
        }
        self = this;
        if (needModal) {
          if (!D('tanMask')) {
            doc.body.appendChild(createMask.call(this));
            this.mask = D('tanMask');
          }
          this.mask.style.display = 'block';
          setTimeout(function() {
            return self.mask.style.opacity = 1;
          }, 0);
        }
        if (!D(this.id)) {
          doc.body.appendChild(createNode.call(this));
          this.node = D(this.id);
        }
        if (isFunction(this.config['onShow'])) {
          this.config['onShow'].call(this);
        }
        if (this.listeners && this.listeners['show']) {
          _fireEvent.call(this, 'show');
        }
        if (this.node.querySelector('.btn-ok')) {
          this.node.querySelector('.btn-ok').addEventListener('click', function() {
            if (isFunction(self.config['ok'])) {
              self.config['ok'].call(self);
            }
            if (self.listeners && self.listeners['ok']) {
              return _fireEvent.call(self, 'ok');
            }
          }, false);
        }
        if (this.node.querySelector('.btn-cancel')) {
          this.node.querySelector('.btn-cancel').addEventListener('click', function() {
            var k;
            if (isFunction(self.config['cancel'])) {
              k = self.config['cancel'].call(self);
            }
            if (self.listeners && self.listeners['cancel']) {
              _fireEvent.call(self, 'cancel');
            }
            if (k === false) {
              return k;
            } else if (self) {
              return self.close();
            }
          }, false);
        }
        if (this.node.querySelector('.close-this')) {
          this.node.querySelector('.close-this').addEventListener('click', function() {
            return self.close();
          }, false);
        }
        if (!this.config['in']) {
          this.config['in'] = {
            name: 'fadeInDown'
          };
        }
        this.config['in'].fn = function() {
          if (isFunction(self.config['afterShow'])) {
            self.config['afterShow'].call(self);
          }
          if (self.listeners && self.listeners['afterShow']) {
            return _fireEvent.call(self, 'afterShow');
          }
        };
        this.node.classList.remove('hidden');
        animate.call(this.node, this.config['in']);
        return this;
      };

      Tan.prototype.close = function() {
        var self;
        self = this;
        if (this.isOperating === false) {
          this.isOperating = true;
          if (this.mask) {
            this.mask.style.opacity = 0;
          }
          if (isFunction(this.config['onClose'])) {
            this.config['onClose'].call(this);
          }
          if (self.listeners && self.listeners['close']) {
            _fireEvent.call(self, 'close');
          }
          if (this.node) {
            if (!this.config['out']) {
              this.config['out'] = {
                name: 'fadeOutUp'
              };
            }
            this.config['out'].fn = function() {
              self.node.classList.add('hidden');
              if (isFunction(self.config['afterClose'])) {
                self.config['afterClose'].call(self);
              }
              if (self.listeners && self.listeners['afterClose']) {
                _fireEvent.call(self, 'afterClose');
              }
              self.isOperating = false;
              if (self.node) {
                doc.body.removeChild(self.node);
              }
              if (self.mask) {
                return doc.body.removeChild(self.mask);
              }
            };
            animate.call(this.node, this.config['out']);
          }
          return this;
        }
      };

      Tan.prototype.on = function(event, fn) {
        _bindEvent.call(this, event, fn);
        return this;
      };

      return Tan;

    })();
    tan = function(config) {
      if (getType(config) !== 'object') {
        config = {};
      }
      return new Tan(config);
    };
    tanAlert = function(msg, fn, enter, leave) {
      return new Tan({
        skin: 'tanAlert',
        title: '提示',
        width: 300,
        height: 'auto',
        content: '<div class="text-center">' + msg + '</div>',
        okVal: '确定',
        ok: function() {
          if (isFunction(fn)) {
            fn.call(this);
          }
          return this.close();
        },
        "in": enter || {
          name: 'fadeInDown',
          duration: 0.35
        },
        out: leave || {
          name: 'fadeOutUp',
          duration: 0.35
        }
      }).show(false);
    };
    tanConfirm = function(msg, ok, cancel) {
      return new Tan({
        skin: 'tanConfirm',
        title: '提示',
        width: 300,
        height: 'auto',
        content: '<div class="text-center">' + msg + '</div>',
        okVal: '确定',
        ok: function() {
          if (isFunction(ok)) {
            return ok.call(this);
          }
        },
        cancelVal: '取消',
        "in": {
          name: 'fadeInDown',
          duration: 0.35
        },
        out: {
          name: 'fadeOutUp',
          duration: 0.35
        },
        cancel: function() {
          if (isFunction(cancel)) {
            cancel.call(this);
          }
          return this.close();
        }
      }).show();
    };
    tanTips = function(msg, time, fn, skin, top) {
      return new Tan({
        skin: 'tanTips ' + (skin || ''),
        title: false,
        top: top || '50px',
        width: 300,
        height: 'auto',
        content: '<div class="text-center">' + msg + '</div>',
        ok: false,
        cancel: false,
        onShow: function() {
          var self;
          self = this;
          return setTimeout(function() {
            return self.close();
          }, time || 2000);
        },
        "in": {
          name: 'fadeInDown',
          duration: 0.35
        },
        out: {
          name: 'fadeOutUp',
          duration: 0.35
        },
        afterClose: function() {
          if (isFunction(fn)) {
            return fn.call(this);
          }
        }
      }).show(false);
    };
    errorTips = function(msg, time, fn, top) {
      return tanTips(msg, time, fn, 'd', top).show(false);
    };
    sucTips = function(msg, time, fn, top) {
      return tanTips(msg, time, fn, 's', top).show(false);
    };
    infoTips = function(msg, time, fn, top) {
      return tanTips(msg, time, fn, 'i', top).show(false);
    };
    warnTips = function(msg, time, fn, top) {
      return tanTips(msg, time, fn, 'w', top).show(false);
    };
    primaryTips = function(msg, time, fn, top) {
      return tanTips(msg, time, fn, 'p', top).show(false);
    };
    return {
      tan: tan,
      tanAlert: tanAlert,
      tanConfirm: tanConfirm,
      tanTips: tanTips,
      errorTips: errorTips,
      sucTips: sucTips,
      infoTips: infoTips,
      warnTips: warnTips,
      primaryTips: primaryTips
    };
  });

}).call(this);

//# sourceMappingURL=shlk-dialog.js.map
