let example = document.getElementById("example"),
	ctx     = example.getContext('2d');
    ctx.fillRect(0, 0, example.width, example.height);

const appData = {
    'snakeLastStep': 0,
    'snakeStep': 150,
    'snakeDirection': 3,
    'snakeNextDirection': 3,
    'snakeColor': 'orange',
    'snakeFootVolor': 'black',
    'infinityLoop': true,
    'snakeSize': 10,
    'snakeRecursionDepth': 1,
    'snakeBody': [[500,520],[500,510],[500,500]],
    'initDrawBody': function(){
        ctx.fillStyle = this.snakeColor;
        this.snakeBody.forEach((item)=>{
            ctx.fillRect(item[0],item[1],this.snakeSize,this.snakeSize);
        })
    },
    'snakeMove': function(){
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
        if (this.infinityLoop){
            if (newX>790){
                newX-=800;
            }
            if (newX<0){
                newX+=800
            }
            if (newY>790){
                newY-=800;
            }
            if (newY<0){
                newY+=800
            }
        }
        this.snakeBody.forEach((item)=>{
            if (item[0]===newX&&item[1]===newY){
                this.snakeCheckItself(null, null, true);
                // if (this.snakeDirection<4){
                //     this.snakeDirection++;
                // }
                // else {
                //     this.snakeDirection = 1;
                // }
            }
        })
        this.snakeBody.unshift([newX, newY]);
        ctx.fillRect(this.snakeBody[0][0],this.snakeBody[0][1],this.snakeSize,this.snakeSize);
        this.snakeTryToFindSomeFood()
        this.snakeCheckItself(newX, newY);
    },
    'snakeCheckItself': function(x, y, distruction=false){
        if ((x<0)||(y<0)||(x>790)||(y>790)||distruction){
            appData.snakeColor = 'blue';
            eatData.foodColor = 'blue';
            ctx.fillStyle = "blue";
            appData.snakeFootVolor = 'blue';
            this.snakeStep = 1000000;
            ctx.fillRect(0, 0, example.width, example.height);
        }
    },
    'snakeBecomeFaster': function(){
        let depth = this.snakeRecursionDepth;
        function recursion(depth){
            if (depth>0){
                appData.snakeMove();
                return recursion(depth-1);
            }
        }
        recursion(depth);
    },
    'snakeTryToFindSomeFood': function(){
        this.snakeBody.forEach((item)=>{
            if (((item[0]>=eatData.foodX)&&(item[0]<(eatData.foodX+eatData.foodSize*10)))&&((item[1]>=eatData.foodY)&&(item[1]<(eatData.foodY+eatData.foodSize*10)))){
                this.snakeBody.push([]);
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, example.width, example.height);
                appData.initDrawBody();
                eatData.spawnEat();
                if (this.snakeStep > 80){
                    this.snakeStep -= 2;
                } else if (this.snakeStep >= 10){
                    this.snakeStep -= 1;
                } else {
                    eatData.foodSize+=1;
                    this.snakeRecursionDepth++;
                    this.snakeStep = 15;
                }
            }
        })
    },
}

const eatData = {
    'foodColor': 'green',
    'foodSize': 1,
    'foodX': 0,
    'foodY': 0,
    'spawnEat': function(){
        ctx.fillStyle = this.foodColor;
        let food = this.checkPosition();
        this.foodX = food[0];
        this.foodY = food[1];
        ctx.fillRect(this.foodX, this.foodY, this.foodSize*10, this.foodSize*10);
    },
    'checkPosition': function(){
        eatX = Math.round((Math.random()*(80-this.foodSize)))*10;
        eatY = Math.round((Math.random()*(80-this.foodSize)))*10;
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
    systime+=4;
    if (systime-appData.snakeStep>appData.snakeLastStep){
        appData.snakeBecomeFaster(appData.snakeRecursionDepth);
        appData.snakeLastStep = systime;
    }
},4);