((root, factory)->
	if(typeof define is 'function' and define.amd)
		define ()->factory()
	else if typeof(module) isnt 'undefined'
		module.exports = factory()
	else
		root.tan = factory()
)(@, ()->
	#工具区
	doc = document
	Q = doc.querySelector.bind(doc)
	D = doc.getElementById.bind(doc)
	QA = doc.querySelectorAll.bind(doc)
	CE = doc.createElement.bind(doc)

	toString = Object::toString

	getType = (everything) ->
		toString.call(everything).replace('[object ', '').replace(']', '').toLowerCase()

	isFunction = (fn) ->
		getType(fn) is 'function'

	now = () -> new Date().getTime()

	_bindEvent = (event, fn) ->

		@listeners = @listeners or {}
		@listeners[event] = @listeners[event] or []
		@listeners[event].push(fn);
		@

		# @node.addEventListener(event, fn , no)

	_fireEvent = (event) ->

		fn.call(@) for fn in @listeners[event] when @listeners[event] and isFunction(fn) if @listeners
		@

	# 创建弹框节点
	createNode = ()->
		div = CE('div')

		# 配置className && id
		className = if @config['skin'] then ' ' + @config['skin'] else ''
		div.className = 'tan-block hidden' + className
		div.id = @id

		# 配置内容
		title = (if @config['title'] isnt false then '<div class="tan-title"><span>' + @config['title'] + '</span><i class="close-this">X</i></div>' else '')
		content = @config['content'] or ''
		okVal = @config['okVal'] or '确定'
		cancelVal = @config['cancelVal'] or '取消'
		btn = (if @config['ok'] isnt false then '<a class="btn btn-ok">' + okVal + '</a>' else '') + (if @config['cancel'] isnt false then '<a class="btn btn-cancel">' + cancelVal + '</a>' else '')

		# 插入内容
		div.innerHTML = title + '<div class="tan-content">' + content + '</div><div class="tan-btn-area">' + btn + '</div>'

		# 配置样式
		c = div.querySelector('.tan-content')
		t = div.querySelector('.tan-title')
		b = div.querySelector('.tan-btn-area')
		otherHeight = (if t then t.clientHeight else 0) + b.clientHeight
		width = if @config['width'] then parseInt(@config['width'], 10) else 200
		height = if @config['height'] then parseInt(@config['height'], 10) else 200
		div.style.marginLeft = -(width / 2) + 'px'
		div.style.marginTop = -((height + otherHeight) / 2) + 'px'
		div.style.zIndex = @config['zIndex'] or '1001'
		div.style.top = @config['top'] or '25%'
		div.style.left = @config['left'] or '50%'
		c.style.width = width + 'px'
		c.style.height = height + 'px'

		# 返回这个node
		div

	# 创建遮罩节点
	createMask = ()->
	#配置属性
		mask = CE('div')
		mask.id = 'tanMask'
		mask.className = 'tan-mask';

		# 配置样式
		background = @config['maskBackground'] or 'rgba(0,0,0,.7)'
		duration = @config['maskTransitionTime'] or '1s'
		style = '-webkit-transition: opacity ' + duration + ' ease-in-out;-webkit-transition: opacity ' + duration + ' ease-in-out;background:' + background

		# 设置样式
		mask.setAttribute('style',style);

		# 返回遮罩节点
		mask

	# 弹出框动画
	animate = (opts)->
		h = ()->
			@classList.remove('animated')
			@classList.remove(opts.name)
			@isAnimating = no
			if getType(opts.fn) is 'function'
				opts.fn.call(@)
			@removeEventListener('webkitAnimationEnd', h, no)
			@removeEventListener('animationend', h, no)

		@addEventListener('webkitAnimationEnd', h, no)
		@addEventListener('animationend', h, no)

		if getType(opts.name) is 'string'
			duration = opts.duration or 1
			delay = if getType(opts.delay) is 'number' then opts.delay else 0
			count = opts.count or 1
			direction = opts.direction

			if not (getType(@isAnimating) is 'boolean')
				@isAnimating = no

			if not @isAnimating

				@isAnimating = yes

				if duration
					duration = duration + 's';
					@style.animationDuration = duration
					@style.webkitAnimationDuration = duration

				if delay
					delay = delay + 's';
					@style.animationDelay = delay
					@style.webkitAnimationDelay = delay

				if direction
					@style.animationDirection = direction
					@style.webkitAnimationDirection = direction

				if not (parseInt(count,10) is 1)
					@style.animationIterationCount = count
					@style.webkitAnimationIterationCount = count

				@classList.add('animated')
				@classList.add(opts.name)

	class Tan

		# 私有属性
		# 参数类型:object
		# 参数格式及默认值:{
		#   title:'',
		#   skin:''     //自定义class
		#   zIndex:1001 //优先级
		#   top:'25%',
		#   left:'50%',
		#   content:'',
		#   maskBackground:'rgba(0,0,0,.7)' //设置遮罩背景颜色
		#   maskTransitionTime:'1s'        //设置遮罩过渡时间
		#   width:200,
		#   height:200,
		#   okVal:'确定',
		#   cancelVal:'取消',
		#   ok:function(){}, //点击确定之后的执行的方法(如果为false将不显示确定按钮)
		#   cancel:function(){}, //点击取消之后执行的方法(如果为false将不显示取消按钮)
		#   onShow:function(){}, //显示之前执行的回调
		#   afterShow:function(){},  //显示完成执行的回调
		#   onClose:function(){},    //关闭之前执行的方法
		#   afterClose:function(){},  //关闭之后执行的方法
		#   in:{                    //弹出框显示的动画
		#       name:'fadeInDown',
		#       duration: 1,
		#		delay: 0,
		#		count: 1,
		#		direction: 'normal',
		#   },
		#   out:{                  //弹出框关闭的动画
		#       name:'fadeOutUp',
		#       duration: 1,
		#		delay: 0,
		#		count: 1,
		#		direction: 'normal',
		#   }
		# 参数没必要全写
		constructor:(@config)->
			# 弹框ID
			@id = 'tan' + now()
			@isOperating = false

		version:'0.1.0'

		# 原型显示方法
		# 参数类型:boolean
		# true: 显示遮罩 / false: 不显示遮罩
		# 默认值: true
		show:(needModal)->

			# 设置参数默认值
			needModal = true if getType(needModal) isnt 'boolean'
			self = @

			# 如果需要遮罩, 打开之
			if needModal
				if not D('tanMask')
					doc.body.appendChild createMask.call(@)
					@mask = D('tanMask')
				@mask.style.display = 'block'
				setTimeout(()->
					self.mask.style.opacity = 1
				,0)

			if not D(@id)
				doc.body.appendChild createNode.call(@)
				@node = D(@id)

			# 执行回调显示前回调
			@config['onShow'].call(@) if isFunction(@config['onShow'])
			_fireEvent.call(@,'show') if @listeners and @listeners['show']

			# 按钮绑定事件
			@node.querySelector('.btn-ok').addEventListener('click',()->
				self.config['ok'].call(self) if isFunction(self.config['ok'])
				_fireEvent.call(self,'ok') if self.listeners and self.listeners['ok']
			,false) if @node.querySelector('.btn-ok')

			@node.querySelector('.btn-cancel').addEventListener('click',()->
				k = self.config['cancel'].call(self) if isFunction(self.config['cancel'])
				_fireEvent.call(self,'cancel') if self.listeners and self.listeners['cancel']
				if k is false
					return k
				else if self
					self.close();
			,false) if @node.querySelector('.btn-cancel')
			@node.querySelector('.close-this').addEventListener('click',()->
				self.close();
			,false) if @node.querySelector('.close-this')

			if not @config['in']
				@config['in'] =
					name : 'fadeInDown'

			@config['in'].fn = ()->
				# 显示后回调
				self.config['afterShow'].call(self) if isFunction(self.config['afterShow'])
				_fireEvent.call(self, 'afterShow') if self.listeners and self.listeners['afterShow']
			@node.classList.remove('hidden');
			animate.call(@node,@config['in']);
			@

		close:()->
			self = @
			if @isOperating is false
				@isOperating = true
				@mask.style.opacity = 0 if @mask

				@config['onClose'].call(@) if isFunction(@config['onClose'])
				_fireEvent.call(self, 'close') if self.listeners and self.listeners['close']
				if @node
					if not @config['out']
						@config['out'] =
							name : 'fadeOutUp'

					@config['out'].fn = ()->
						self.node.classList.add('hidden');
						self.config['afterClose'].call(self) if isFunction(self.config['afterClose'])
						_fireEvent.call(self, 'afterClose') if self.listeners and self.listeners['afterClose']
						self.isOperating = false
						doc.body.removeChild(self.node) if self.node
						doc.body.removeChild(self.mask) if self.mask
						# 销毁对象实例, 防止多次创建弹框消耗内存
						# self = null

					animate.call(@node,@config['out']);
				@

		on:(event,fn)->
			_bindEvent.call(@, event, fn)
			@

	tan = (config)->
		config = {} if getType(config) isnt 'object'
		new Tan(config)

	#提示框
	tanAlert = (msg, fn, enter, leave)->
		new Tan(
			skin:'tanAlert'
			title : '提示'
			width : 300
			height : 'auto'
			content : '<div class="text-center">' + msg + '</div>'
			okVal:'确定'
			ok:()->
				fn.call(@) if isFunction(fn)
				@close()
			in: enter || { name : 'fadeInDown' , duration:0.35}
			out: leave || { name : 'fadeOutUp' , duration:0.35}
		).show(false)

	#提示确认框
	tanConfirm = (msg, ok, cancel)->
		new Tan(
			skin:'tanConfirm'
			title : '提示'
			width : 300
			height : 'auto'
			content : '<div class="text-center">' + msg + '</div>'
			okVal:'确定'
			ok:()->
				ok.call(@) if isFunction(ok)
			cancelVal: '取消'
			in: { name : 'fadeInDown' , duration:0.35}
			out: { name : 'fadeOutUp' , duration:0.35}
			cancel: ()->
				cancel.call(@) if isFunction(cancel)
				@close()
		).show();

	#短暂提示
	tanTips = (msg, time, fn, skin, top) ->
		new Tan(
			skin:'tanTips ' + (skin || '')
			title : no
			top: top || '50px'
			width : 300
			height : 'auto'
			content : '<div class="text-center">' + msg + '</div>'
			ok:false
			cancel:false
			onShow : ()->
				self = @
				setTimeout(()->
					self.close()
				, time || 2000)
			in: { name : 'fadeInDown', duration:0.35 }
			out: { name : 'fadeOutUp', duration:0.35 }
			afterClose:()->
				fn.call(@) if isFunction(fn)
		).show(no)

	errorTips = (msg, time, fn, top) ->
		tanTips(msg, time, fn, 'd', top).show(no)

	sucTips = (msg, time, fn, top) ->
		tanTips(msg, time, fn, 's', top).show(no)

	infoTips = (msg, time, fn, top) ->
		tanTips(msg, time, fn, 'i', top).show(no)

	warnTips = (msg, time, fn, top) ->
		tanTips(msg, time, fn, 'w', top).show(no)

	primaryTips = (msg, time, fn, top) ->
		tanTips(msg, time, fn, 'p', top).show(no)

	return {
		tan
		tanAlert
		tanConfirm
		tanTips
		errorTips
		sucTips
		infoTips
		warnTips
		primaryTips
	}
)



