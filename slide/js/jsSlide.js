/**
 * Created by njs2000 on 2016-12-02.
 */
var jsSlide = (function(){
	function jsSlide(options){
		var _this = this;
		this.target = $(options.wrapBox);
		this.nowIdx = 0;
		this.prevIdx = 0;
		this.slide_list = $(this.target.find(options.listName || '.slide_list'));
		this.slide_listLength = this.slide_list.children().length;

		this.paging = $(this.target.find(options.pagingClass || '.paging'));
		this.pagingNum = this.paging.find('a');
		this.btnNext = this.target.find('.next');
		this.btnPrev = this.target.find('.prev');
		this.btnStop = this.target.find('.stop');
		this.effect = options.effect || 'showHide'; //showHide, fadeShowHide, slidingShowHide
		this.effectSpeed = options.effectSpeed || 0;
		this.auto = options.auto || false;
		this.autoDuration = options.autoDuration || 2000; //1000 이상
		this.Inter;
		this.isPlay = false;
		this.isAutoPlaying = false;

		this.init();
	};

	jsSlide.prototype.init = function(){
		this.slide_list.children('li').eq(this.nowIdx).css({'display':'block','opacity':1});// 처음꺼 보이기
		this.pagingNum.eq(this.nowIdx).addClass('on');// 처음꺼 넘버링 표시

		this.autoControl();
		this.clickEv();
	};

	jsSlide.prototype.clickEv = function(){
		var _this = this;
		this.btnNext.on('click',function(){
			_this.next();
			return false;
		});

		this.btnPrev.on('click',function(){
			_this.prev();
			return false;
		});

		this.pagingNum.on('click',function(){
			aNum = $(this).index();
			_this.curr(aNum);
			return false;
		});

		this.btnStop.on('click',function(){
			setTimeout(_this.autoControl(),_this.autoDuration);
			console.log(_this.isAutoPlaying);
			return false;
		})


	};

	jsSlide.prototype.prev = function(){
		var _this = this;
		if(_this.isPlay) return;
		_this.isPlay = true;
		this.nowIdx = this.nowIdx <=0 ? 0 : this.nowIdx-1;
		_this.isPlay = false;
		this.choiceShowHide();
	};

	jsSlide.prototype.next = function(){
		var _this = this;
		if(_this.isPlay) return;
		_this.isPlay = true;

		this.nowIdx = this.nowIdx  >= this.slide_listLength-1 ? this.slide_listLength-1 : this.nowIdx+1;
		_this.isPlay = false;
		this.choiceShowHide();
	};

	jsSlide.prototype.curr = function(n){
		this.nowIdx = n;
		this.choiceShowHide();
	};

	jsSlide.prototype.choiceShowHide = function(){
		switch (this.effect){
			default :
				this.showHide(this.prevIdx, this.nowIdx);
				break;
			case 'showHide' :
				this.showHide(this.prevIdx, this.nowIdx);
				break;
			case 'fadeShowHide' :
				this.fadeShowHide(this.prevIdx, this.nowIdx);
				break;
			case 'slidingShowHide':
				this.slidingShowHide(this.prevIdx, this.nowIdx);
				break;
		}
	};

	jsSlide.prototype.showHide = function(pre, now){
		if(this.isPlay) return;
		this.isPlay = true;
		this.slide_list.children('li').eq(pre).css({'display':'none','opacity':0});
		this.slide_list.children('li').eq(now).css({'display':'block','opacity':1});
		this.pagingOnOff(pre,now);
		this.prevIdx = this.nowIdx;
		this.isPlay = false;
	};

	jsSlide.prototype.fadeShowHide = function(pre, now){
		var _this = this;
		if(_this.isPlay) return;
		_this.isPlay = true;
		this.slide_list.children('li').eq(pre).stop().animate({'opacity':0},_this.effectSpeed,function(){
			$(this).css({'display':'none'});
		});
		this.slide_list.children('li').eq(now).show().stop().animate({'opacity':1},_this.effectSpeed);
		this.pagingOnOff(pre,now);
		this.prevIdx = this.nowIdx;
		_this.isPlay = false;
	};

	jsSlide.prototype.slidingShowHide = function(pre, now){
		var _this = this;
		if(_this.isPlay) return;
		_this.isPlay = true;
		if(pre !== this.nowIdx){
			k = pre <= now ? '100%' : '-100%';
			r = pre <= now ? '-100%' : '100%';
			this.slide_list.children('li').eq(pre).stop().animate({'opacity':0,'left':r},_this.effectSpeed,function(){
				$(this).stop().animate({'display':'none'},_this.effectSpeed,function(){
					_this.isPlay = false;
				});
			});
			this.slide_list.children('li').eq(now).css({'display':'block','opacity':'1'}).stop().animate({'left':k},0,function(){
				$(this).animate({'left':'0'},_this.effectSpeed, function(){
					_this.isPlay = false;
				});
//
			});
			this.pagingOnOff(pre,now);
			this.prevIdx = this.nowIdx;
		}
	};

	jsSlide.prototype.pagingOnOff = function(pre, now){
		this.paging.children('a').eq(pre).removeClass('on');
		this.paging.children('a').eq(now).addClass('on');
	};

	jsSlide.prototype.autoControl = function(){
		var _this = this;
		if(this.auto){
			clearInterval(_this.Inter);
			_this.Inter = setInterval(autoFnc,_this.effectSpeed+_this.autoDuration);
			function autoFnc(){
				if(_this.isPlay) return;
				_this.nowIdx++;
				_this.nowIdx = _this.nowIdx === _this.slide_listLength ? 0 : _this.nowIdx;
				_this.choiceShowHide(_this.prevIdx, _this.nowIdx);
				_this.isPlay = true;
				_this.prevIdx = _this.nowIdx;
				_this.isPlay = false;
			}

			if(this.isAutoPlaying){
				clearInterval(_this.Inter);
				this.btnStop.text('play!');
				this.isAutoPlaying = false;
			}else{
				this.isAutoPlaying = true;
				this.btnStop.text('stop!');
				clearInterval(_this.Inter);
				_this.Inter = setInterval(autoFnc,_this.effectSpeed+_this.autoDuration);
			}

		}
	};



	return jsSlide;
}());