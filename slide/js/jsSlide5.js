var jsSlide = (function(){
	'use strict';

	/*
	1.사용자 옵션 // 초기index설정, 슬라이드 모드 설정(noneblock, fade, slide), auto로 재생여부
	*/
	function jsSlide(container, options){

		var container = $(container);
		this.defaults  = {
			isPaging : options.paging || true,
			slideClass : options.slideClass  || '.jsSlide',
			pageClass : options.pageClass || '.jsSlide-paging',
			paging : {
				style : options.pageingStyle || 'dark'
			},
			auto : options.auto || false,
			btnNextClass : options.btnNext || '.jsSlide-btn-next',
			btnPrevClass : options.btnPrev || '.jsSlide-btn-prev',
			btnStopClass : options.btnStop || '.jsSlide-btn-stop',

			slideListClass : options.slideListClass ||'.jsSlide-list',

			autoDuration : options.autoDuration || 1000,
			effectMode : options.effectMode || 'normal', //'sliding','fade'
			effectSpeed : options.effectSpeed || 0,

			pastIdx : 0,
			presentIdx : options.firstIdx || 0,
			loop : options.loooop || false,

			timer : {},
			timerSpeed : options.timerSpeed || 3000
		};

		this.set = {
			slideEleLength : container.find(this.defaults.slideClass).length,
			slideEle : container.find(this.defaults.slideClass),
			pageWrapEle : container.find(this.defaults.pageClass),
			pageEle : container.find(this.defaults.pageClass).find('a'),
			btnNextEle : container.find(this.defaults.btnNextClass),
			btnPrevEle : container.find(this.defaults.btnPrevClass),
			btnStopEle: container.find(this.defaults.btnStopClass)


		};




			//$(this.defaults.slideWrap).find(this.defaults.pageClass).addClass(this.defaults.paging.style);



		/*var initVar = function(){
			this.target = $(wrapBox);
			this.slide_list = $(this.target.find(options.listName || '.jsSlide-list'));
			this.slide_listLength = this.slide_list.children().length;
			this.paging = $(this.target.find(options.pagingClass || '.jsSlide-paging'));
			this.pagingNum = this.paging.find('a');
			this.btnNext = this.target.find('.jsSlide-btn-next');
			this.btnPrev = this.target.find('.jsSlide-btn-prev');
			this.effect = options.effect || 'showHide'; //showHide, fadeShowHide, slidingShowHide
			this.effectSpeed = options.effectSpeed || 0;
			this.auto = options.auto || false;
			this.autoDuration = options.autoDuration || 2000; //1000 이상
			this.nowIdx = 0;
			this.prevIdx = 0;
			this.isPlay = false;
		};*/

		this.init();
		this.clickHandle();
	};


	jsSlide.prototype.clickHandle = function(){
		var $this = this;


		this.set.btnNextEle.on('click',function(){
			$this.next();
			$this.autoStop();
			$this.autoPlay();
		});

		this.set.btnPrevEle.on('click',function(){
			$this.previous();
			$this.autoStop();
			$this.autoPlay();
		});

		this.set.pageEle.on('click',function(){
			var selfIdx = $(this).index();
			$this.reset(selfIdx);
			$this.autoStop();
			$this.autoPlay();
		});

		this.set.btnStopEle.on('click',function(){
			$this.autoStop();

		});
	};


	jsSlide.prototype.init = function(){
		console.log(this.defaults.presentIdx)
		this.set.pageWrapEle.addClass(this.defaults.paging.style);
		this.set.pageEle.eq(this.defaults.presentIdx).addClass('on');
		this.set.slideEle.eq(this.defaults.presentIdx).css({'display':'block'});
		this.autoPlay();
	};

	jsSlide.prototype.previous = function(){
		this.defaults.pastIdx = this.defaults.presentIdx;

		if(!this.defaults.loop){
			this.defaults.presentIdx = this.defaults.presentIdx <= 0 ? 0 : this.defaults.presentIdx-1;
		}else{
			this.defaults.presentIdx = this.defaults.presentIdx <= 0 ? this.set.slideEleLength-1 : this.defaults.presentIdx-1;
		}
		this.slideChange(this.defaults.effectMode);
		this.pagingChange();

		console.log('presentIdx :'+this.defaults.presentIdx ,'pastIdx :'+this.defaults.pastIdx);
	};

	jsSlide.prototype.next = function(){
		this.defaults.pastIdx = this.defaults.presentIdx;
		if(!this.defaults.loop){
			this.defaults.presentIdx = this.defaults.presentIdx >= this.set.slideEleLength-1 ? this.defaults.presentIdx :  this.defaults.presentIdx+1
		}else{
			this.defaults.presentIdx = this.defaults.presentIdx >= this.set.slideEleLength-1 ? 0 : this.defaults.presentIdx = this.defaults.presentIdx >= this.set.slideEleLength-1 ? this.defaults.presentIdx :  this.defaults.presentIdx+1;
		}

		this.slideChange(this.defaults.effectMode);
		this.pagingChange();

		console.log('presentIdx :'+this.defaults.presentIdx ,'pastIdx :'+this.defaults.pastIdx);
	};

	jsSlide.prototype.reset = function(k){
		this.defaults.pastIdx = this.defaults.presentIdx;
		this.defaults.presentIdx = k;

		this.slideChange(this.defaults.effectMode);
		this.pagingChange();

		console.log('presentIdx :'+this.defaults.presentIdx, 'pastIdx :'+this.defaults.pastIdx);
	};

	jsSlide.prototype.slideChange = function(mode){
		var $this = this;
		var actions = {
			normal : function(){
				$this.set.slideEle.eq($this.defaults.pastIdx).css({'display':'none'});
				$this.set.slideEle.eq($this.defaults.presentIdx).css({'display':'block'});
			},
			fade : function(){
				$this.set.slideEle.eq($this.defaults.pastIdx).stop(true,true).fadeOut(1000);
				$this.set.slideEle.eq($this.defaults.presentIdx).stop(true,true).fadeIn(1000);
			},
			sliding : function(){

			}
		}

		if(this.defaults.pastIdx === this.defaults.presentIdx) return;
		actions[mode]();

	};

	jsSlide.prototype.pagingChange = function(){
		this.set.pageEle.eq(this.defaults.pastIdx).removeClass('on');
		this.set.pageEle.eq(this.defaults.presentIdx).addClass('on');
	};

	jsSlide.prototype.autoPlay = function(){
		if(this.defaults.auto && this.defaults.loop){
			var $this = this;
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				$this.next();
			},this.defaults.timerSpeed)
		}
	};

	jsSlide.prototype.autoStop = function(){
		clearInterval(this.timer);
	}

	return jsSlide;
}());
