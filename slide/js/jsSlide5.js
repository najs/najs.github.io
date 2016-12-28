var jsSlide = (function(){
"use strict";
/*
사용자 옵션 // 초기index설정, 슬라이드 모드 설정(normal, fade, slide), auto로 재생여부
*/
	function jsSlide(container, options){
		var Container = $(container);
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
			timerSpeed : options.timerSpeed || 3000,
			isPlay : true
		};

		this.set = {
			slideEleLength : Container.find(this.defaults.slideClass).length,
			slideEle : Container.find(this.defaults.slideClass),
			pageWrapEle : Container.find(this.defaults.pageClass),
			pageEle : Container.find(this.defaults.pageClass).find('a'),
			btnNextEle : Container.find(this.defaults.btnNextClass),
			btnPrevEle : Container.find(this.defaults.btnPrevClass),
			btnStopEle: Container.find(this.defaults.btnStopClass)
		};

		this.init();
	}

	jsSlide.prototype.init = function(){
		this.set.pageWrapEle.addClass(this.defaults.paging.style);
		this.set.pageEle.eq(this.defaults.presentIdx).addClass('on');
		this.set.slideEle.eq(this.defaults.presentIdx).css({'display':'block'});
		this.autoPlay();
		this.clickHandle();
	};

	jsSlide.prototype.clickHandle = function(){
		var $this = this;

		this.set.btnNextEle.on('click',function(){
			if(!$this.defaults.isPlay) return;
			$this.next();
			$this.autoPlay();
		});

		this.set.btnPrevEle.on('click',function(){
			if(!$this.defaults.isPlay) return;
			$this.previous();
			$this.autoPlay();
		});

		this.set.pageEle.on('click',function(e){
			e.preventDefault();
			if(!$this.defaults.isPlay) return;
			var selfIdx = $(this).index();
			$this.reset(selfIdx);
			$this.autoPlay();
		});

		this.set.btnStopEle.on('click',function(){
			$this.autoControl();
		});
	};

	jsSlide.prototype.previous = function(){
		this.defaults.pastIdx = this.defaults.presentIdx;
		if(!this.defaults.loop){
			this.defaults.presentIdx = this.defaults.presentIdx <= 0 ? 0 : this.defaults.presentIdx-1;
		}else{
			this.defaults.presentIdx = this.defaults.presentIdx <= 0 ? this.set.slideEleLength-1 : this.defaults.presentIdx-1;
		}

		this.pagingChange();
		this.slideChange('prev',this.defaults.effectMode);


		// console.log('presentIdx :'+this.defaults.presentIdx ,'pastIdx :'+this.defaults.pastIdx);
	};

	jsSlide.prototype.next = function(){
		this.defaults.pastIdx = this.defaults.presentIdx;
		if(!this.defaults.loop){
			this.defaults.presentIdx = this.defaults.presentIdx >= this.set.slideEleLength-1 ? this.defaults.presentIdx :  this.defaults.presentIdx+1;
		}else{
			this.defaults.presentIdx = this.defaults.presentIdx >= this.set.slideEleLength-1 ? 0 : this.defaults.presentIdx = this.defaults.presentIdx >= this.set.slideEleLength-1 ? this.defaults.presentIdx :  this.defaults.presentIdx+1;
		}
		this.slideChange('next',this.defaults.effectMode);
		this.pagingChange();
		// console.log('presentIdx :'+this.defaults.presentIdx ,'pastIdx :'+this.defaults.pastIdx);
	};

	jsSlide.prototype.reset = function(k){
		this.defaults.pastIdx = this.defaults.presentIdx;
		this.defaults.presentIdx = k;
		this.slideChange('reset',this.defaults.effectMode);
		this.pagingChange();
		// console.log('presentIdx :'+this.defaults.presentIdx, 'pastIdx :'+this.defaults.pastIdx);
	};

	jsSlide.prototype.slideChange = function(dir,mode){
		var $this = this,
				actions = {},
				run = {};

		actions.normal = function(){
			$this.set.slideEle.eq($this.defaults.pastIdx).css({'display':'none'});
			$this.set.slideEle.eq($this.defaults.presentIdx).css({'display':'block'});
		};
		actions.fade = function(){
			if(!$this.defaults.isPlay) return;
			$this.defaults.isPlay = false;
			$this.set.slideEle.eq($this.defaults.pastIdx).stop(true, true).fadeOut($this.defaults.effectSpeed,function(){
				$this.defaults.isPlay = true;
			});
			$this.set.slideEle.eq($this.defaults.presentIdx).stop(true, true).fadeIn($this.defaults.effectSpeed,function(){
				$this.defaults.isPlay = true;
			});
		};
		actions.sliding = {
			next : function(){
				if(!$this.defaults.isPlay) return;
				$this.defaults.isPlay = false;
				$this.set.slideEle.eq($this.defaults.pastIdx)
					.css({'display':'block', 'left':'0'})
					.stop(true, true).animate({'left':'-100%'}, $this.defaults.effectSpeed, function(){
					$(this).css({'display':'none'});
					$this.defaults.isPlay = true;
				});
				$this.set.slideEle.eq($this.defaults.presentIdx)
					.css({'display':'block', 'left':'100%'})
					.stop(true, true).animate({'left':0}, $this.defaults.effectSpeed,function(){
						$this.defaults.isPlay = true;
				});
			},
			prev : function(){
				if(!$this.defaults.isPlay) return;
				$this.defaults.isPlay = false;
				$this.set.slideEle.eq($this.defaults.pastIdx)
					.css({'display':'block', 'left':'0'})
					.stop(true, true).animate({'left':'100%'}, $this.defaults.effectSpeed, function(){
					$(this).css({'display':'none'});
					$this.defaults.isPlay = true;
				});
				$this.set.slideEle.eq($this.defaults.presentIdx)
					.css({'display':'block', 'left':'-100%'})
					.stop(true, true).animate({'left':0}, $this.defaults.effectSpeed,function(){
						$this.defaults.isPlay = true;
				});
			}
		};

		run.next = {
			normal : function(){
				actions.normal();
			},
			fade : function(){
				actions.fade();
			},
			sliding : function(){
				actions.sliding.next();
			}
		};
		run.prev = {
			normal : function(){
				actions.normal();
			},
			fade : function(){
				actions.fade();
			},
			sliding : function(){
				actions.sliding.prev();
			}
		};
		run.reset = {
			normal : function(){
				actions.normal();
			},
			fade : function(){
				actions.fade();
			},
			sliding : function(){
				if($this.defaults.pastIdx > $this.defaults.presentIdx){
					actions.sliding.prev();
				} else{
					actions.sliding.next();
				}
			}
		};

		if(this.defaults.pastIdx === this.defaults.presentIdx) return;
		run[dir][mode]();
	};

	jsSlide.prototype.pagingChange = function(){
		this.set.pageEle.eq(this.defaults.pastIdx).removeClass('on');
		this.set.pageEle.eq(this.defaults.presentIdx).addClass('on');
	};

	jsSlide.prototype.autoPlay = function(){
		if(!this.defaults.loop){
			this.set.btnStopEle.remove();
			return;
		}

		if(this.defaults.auto){
			this.set.btnStopEle.html('재생중!');
			var $this = this;
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				$this.next();
			},this.defaults.timerSpeed);
		}
	};

	jsSlide.prototype.autoStop = function(){
		this.set.btnStopEle.html('멈춤!');
		clearInterval(this.timer);
	};

	jsSlide.prototype.autoControl = function(){
		if(this.defaults.auto){
			this.defaults.auto = false;
			this.autoStop();
		}else{
			this.defaults.auto = true;
			this.autoPlay();
		}
		// console.log(this.defaults.auto)
	};

	return jsSlide;
}());
