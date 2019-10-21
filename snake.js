let example = document.getElementById("example"),
	ctx     = example.getContext('2d');
    ctx.fillRect(0, 0, example.width, example.height);

const appData = {
    'snakeLastStep': 0,
    'snakeStep': 500,
    'snakeDirection': 3,
    'snakeNextDirection': 3,
    'snakeColor': 'orange',
    'snakeFootVolor': 'black',
    'snakeSize': 10,
    'snakeBody': [[500,520],[500,510],[500,500]],
    'initDrawBody': function(){
        ctx.fillStyle = this.snakeColor;
        this.snakeBody.forEach((item)=>{
            ctx.fillRect(item[0],item[1],this.snakeSize,this.snakeSize);
        })
    },
    'snakeMove': function(direction){
        //Remove the tail
        ctx.fillStyle = this.snakeFootVolor;
        ctx.fillRect(this.snakeBody[this.snakeBody.length-1][0], this.snakeBody[this.snakeBody.length-1][1], this.snakeSize, this.snakeSize)
        this.snakeBody = this.snakeBody.slice(0,this.snakeBody.length-1)
        //Drow a head
        ctx.fillStyle = this.snakeColor;
        let newX = this.snakeBody[0][0];
        let newY = this.snakeBody[0][1];
        let possi = !((this.snakeDirection - this.snakeNextDirection === 2)||(this.snakeDirection - this.snakeNextDirection === -2));
        if (possi){
            this.snakeDirection = this.snakeNextDirection;
        }
        switch (this.snakeDirection) {
            case 1:
                newY-=this.snakeSize;
                break;
            case 2:
                newX+=this.snakeSize;
                break;
            case 3:
                newY+=this.snakeSize;
                break;
            case 4:
                newX-=this.snakeSize;
                break;
        }
        if (this.newX === eatData.foodX){
            console.log('fooof');
        }
        this.snakeBody.forEach((item)=>{
            if (item[0]===newX&&item[1]===newY){
                this.snakeCheckItself(null, null, true);
            }
        })
        this.snakeBody.unshift([newX, newY]);
        ctx.fillRect(this.snakeBody[0][0],this.snakeBody[0][1],this.snakeSize,this.snakeSize);
        this.snakeBody.forEach((item)=>{
            if ((item[0]===eatData.foodX)&&(item[1]===eatData.foodY)){
                this.snakeBody.push([]);
                eatData.spawnEat();
                if (this.snakeStep > 50){
                    this.snakeStep -= 50;
                } else {
                    this.snakeStep = this.snakeStep /2 + 8;
                }
                console.log(this.snakeStep)
            }
        })
        this.snakeCheckItself(newX, newY);
    },
    'snakeCheckItself': function(x, y, distruction=false){
        if ((x<0)||(y<0)||(x>790)||(y>790)||distruction){
            appData.snakeColor = 'blue';
            eatData.foodColor = 'blue';
            ctx.fillStyle = "blue";
            appData.snakeFootVolor = 'blue';
            ctx.fillRect(0, 0, example.width, example.height);
        }
    },
}

const eatData = {
    'foodColor': 'green',
    'foodX': 0,
    'foodY': 0,
    'spawnEat': function(){
        ctx.fillStyle = this.foodColor;
        let food = this.checkPosition();
        this.foodX = food[0];
        this.foodY = food[1];
        ctx.fillRect(this.foodX, this.foodY, 10, 10);
    },
    'checkPosition': function(){
        eatX = Math.round((Math.random()*80))*10;
        eatY = Math.round((Math.random()*80))*10;
        if (appData.snakeBody.includes([eatX, eatY])){
            return eatData.checkPosition()
        } else {
            return [eatX, eatY]
        }
    },
}

document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyW') {
        appData.snakeNextDirection = 1;
    } else if (event.code == 'KeyA'){
        appData.snakeNextDirection = 4;
    } else if (event.code == 'KeyS'){
        appData.snakeNextDirection = 3;
    } else if (event.code == 'KeyD'){
        appData.snakeNextDirection = 2;
    }
  });

appData.initDrawBody();
eatData.spawnEat();

let systime = 0;
setInterval(()=>{
    systime+=5;
    if (systime-appData.snakeStep>appData.snakeLastStep){
        appData.snakeMove();
        appData.snakeLastStep = systime;
    }
},5);