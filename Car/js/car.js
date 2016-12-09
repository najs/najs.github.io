var d = 1000; //거리

var Car = (function(){
	function Car(name,engine, wheel){
		_this = this;
		this.carName = name;
		this.engine = engine;
		this.wheel = wheel;
		this.speed = 0;
	}

	window.onkeydown = function(event) {
	    switch(event.keyCode){
			case 39 : //오른쪽키
				_this.speedUp(1);
				break;
			case 37 : //왼쪽키
				_this.speedDown(1);
				break;
			case 40 : //아래키
				_this.speedDown(10);
				break;
			case 38 : //위키
				_this.speedUp(10);
				break;
			case 32 : //스페이스키
				_this.boost();
				break;
		}
	}
	return Car;
}());

Car.prototype.speedNow = function(num){
	this.speed = num;
	this.wheel.movement(this.speed);

	return this.speed;
};

Car.prototype.speedUp = function(num){
	this.speed += num >= 0 ? num :1;
	this.wheel.movement(this.speed);

	return this.speed;
};
Car.prototype.speedDown = function(num){
	num < 0 ? num = 0 : num;
	num >= 0 ? this.speed-= num : this.speed--;
	this.wheel.movement(this.speed);
	return this.speed < 0 ? this.speed = 0 : this.speed;
};
Car.prototype.changeSpeed = function(num){
	this.speed += num !== 0 ? num :1;
	this.wheel.movement(this.speed);
	return this.speed <= 0 ? 0 :this.speed;
};;
Car.prototype.boost = function(){
	var _self = this;
	var preSpeed = this.speed;
	this.speed *= this.speed;
	setTimeout(function(){
		_self.speed = preSpeed;
	},3000);
	this.wheel.movement(this.speed);
	return this.speed;
};

//휠

var Wheel = (function(){
	function Wheel(WheelName) {
		this.name = name || '고무타이어';
		this.wheelElements = document.querySelectorAll('.wheel');

		Wheel.prototype.movement = function(speed){
			var speed = speed;
			var wheelSpeed;
			var wheelLength = this.wheelElements.length;

			speed <= 0 ? wheelSpeed = 0: wheelSpeed=10/speed;

			for(i=0;i<=wheelLength-1;i++){
				this.wheelElements[i].style.animationDuration = wheelSpeed+'s'; //모든 바퀴 데굴데굴 돔
			}
			carMove(speed); //차움직임
		}
	}
	return Wheel;
}());


//엔진
var Engine = (function (){
	var cnt = 0;
	function Engine(){
		this.serial = cnt++;
	}
	return Engine;
}(this.serial));

//차를 나가게 하자
var pos2 = 0;
var carMove = (function(){
	var bus = document.getElementById("bus1");
	var x; //speed만큼 늘어남
	var xv; //0.01 초당 움직임

	function carMove(speed){
		stop();
		speed<=0 ? x=0:x=speed/100;

		xv = setInterval(moving,10);
	}
	function moving(){
		if (pos2>=d && pos2 > 0) {  //주어진 거리보다 커지면 멈춤
			stop();
			document.querySelectorAll('.wheel')[0].style.animationDuration = '0s';
			document.querySelectorAll('.wheel')[1].style.animationDuration = '0s';
			x=0;
		}
		pos2+=x;
		pos2 < 0 ? pos2=0 : pos2
		bus.style.left = pos2+'px';
	}

	function stop(){
		clearInterval(xv);
	}
	return carMove;
}());



// --------------------------------------------------------------- //
var car2 = new Car('유치원붕붕이',new Engine, new Wheel());





//배경울 움직이자
//var pos = 0;
/*var bgMove = (function(){
	var v;
	var itv;
	function bgMove(speed){
		stop();
		if(speed==0) return;
		v = speed;
		itv = setInterval(moving, 16);
	}
	function moving(){
		document.querySelectorAll(".car_wrap")[0].style.backgroundPosition = -pos+"px 0px";
		pos+=v;
	}
	function stop(){
		clearInterval(itv)
	}
	return bgMove;
})();*/