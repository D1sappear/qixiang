<!--
 * @Author: your name
 * @Date: 2020-05-06 09:29:04
 * @LastEditTime: 2020-05-24 19:38:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \weather-live-ui\src\views\RadarEcho\index.vue
 -->
<template>
    <div id='wrapper'>
        <!-- <remote-css cdn="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css"></remote-css> -->
        <div id="container">
        </div>
    </div>         
</template>


<script>
    import { radarList } from '@/api/weather/radarEcho.js';
    import { jsPanel } from 'jspanel4'
    export default {
        data() {
            return {
                map: null, // 地图实例
                jspanel: null, // 浮动窗口
                imageLayer: null,// 新建图片图层
                radarList: {}, // 雷达回波数据
                imgIndex: 7, // 初始图片下标
                barWidth: 4, // 初始进度条长度
                isPlay: false, // 初始播放状态
                dateList: [], // 事件数据
                dateOne: '', // 时间1
                dateTwo: '', // 时间2
                dateThr: '', // 时间3
                dateFou: '', // 时间4
                dateFiv: '', // 时间5
                dateSix: '', // 时间6
                dateSev: '', // 时间7
                dateEig: '', // 时间8
            };
        },
        mounted () {
            this.initMap()
        },
        methods: {
            initMap() {    
                // 创建地图实例          
                this.map = new AMap.Map('container',{
                    resizeEnable: true, //是否监控地图容器尺寸变化
                    zoom: 7,
                    mapStyle: 'amap://styles/whitesmoke', //设置地图的显示样式
                });

                radarList().then(response => {
                        this.radarList = response.data // 所有雷达数据
                        this.dateList = this.radarList.dateList // 时间数据
                        console.log(this.radarList)
                        
                        // 将数据中经纬度字符串转换为数组
                        let getArray = str => {
                            str = str.split(',')
                            console.log(str)
                            return str
                        }
                        // 接收数据中图层的西南和东北两个角的经纬度
                        let southWest = getArray(this.radarList.southWest)
                        let northEast = getArray(this.radarList.northEast)

                        // 将数据中时间数组的小时分钟分离开
                        let getHoursAndMinute = str => {
                            str = str.substring(11,16)
                            return str
                        }
                        this.dateOne = getHoursAndMinute(this.dateList[7])
                        this.dateTwo = getHoursAndMinute(this.dateList[6])
                        this.dateThr = getHoursAndMinute(this.dateList[5])
                        this.dateFou = getHoursAndMinute(this.dateList[4])
                        this.dateFiv = getHoursAndMinute(this.dateList[3])
                        this.dateSix = getHoursAndMinute(this.dateList[2])
                        this.dateSev = getHoursAndMinute(this.dateList[1])
                        this.dateEig = getHoursAndMinute(this.dateList[0])

                        // 创建新的窗口
                        this.jspanel = jsPanel.create({
                            resizeit: {
                                disable: true
                            },
                            headerTitle: '控制台',
                            theme: '#5197E6',
                            content: '<div class="numberTime">&nbsp;<span class="timeOne">'+ this.dateOne +'</span>&nbsp;&nbsp;<span class="timeTwo">'+ this.dateTwo +'</span>&nbsp;&nbsp;<span class="timeThr">'+ this.dateThr +'</span>&nbsp;&nbsp;<span class="timeFou">'+ this.dateFou +'</span>&nbsp;&nbsp;<span class="timeFiv">'+ this.dateFiv +'</span>&nbsp;&nbsp;<span class="timeSix">'+ this.dateSix +'</span>&nbsp;&nbsp;<span class="timeSev">'+ this.dateSev +'</span>&nbsp;&nbsp;<span class="timeEig">'+ this.dateEig +'</span>&nbsp;&nbsp;</div><div class="container"><div class="row"><div class="col-md-offset-3 col-md-6"><div class="progress"><div class="progress-bar"></div></div></div><div class="player">&nbsp;&nbsp;<i class="iconfont icon-kuaitui"></i>&nbsp;&nbsp;&nbsp;&nbsp;<i class="iconfont icon-video-control"></i>&nbsp;&nbsp;&nbsp;&nbsp;<i class="iconfont icon-kuaijin"></i></div></div><div class="timeInitial">'+ this.dateList[this.imgIndex] +'</div></div>', // 内容
                            container: '#wrapper', // 父容器
                            position: '-400px -330px', // 相对于父容器的定位
                            border: 'none',
                            borderRadius: '0.5rem',
                            onclosed: () => { // 关闭时的回调函数
                               
                            },
                            panelSize: { // 浮动窗口总容器大小
                                width: '550',
                                height: '150'
                            },
                            dragit: {  // 拖拽icon
                                cursor: 'grab'
                            },
                            headerControls: { // 头部工具栏
                                close: 'remove',
                                maximize: 'remove',
                                minimize: 'remove',
                                size: 'xs',
                            },
                            contentOverflow: 'hidden',
                        });

                        let bar = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .container .row .col-md-offset-3 .progress .progress-bar') // 进度条
                        let numberT1 = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .numberTime .timeOne') // 时间1
                        let numberT2 = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .numberTime .timeTwo') // 时间2
                        let numberT3 = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .numberTime .timeThr') // 时间3
                        let numberT4 = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .numberTime .timeFou') // 时间4
                        let numberT5 = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .numberTime .timeFiv') // 时间5
                        let numberT6 = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .numberTime .timeSix') // 时间6
                        let numberT7 = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .numberTime .timeSev') // 时间7
                        let numberT8 = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .numberTime .timeEig') // 时间8

                        let timeInitial = document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .container .timeInitial') // 初始时间

                        let timer; // 定时器

                        // 给快退按键绑定点击函数
                        document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .container .row .player .icon-kuaitui').onclick = ( e => {
                            clearInterval(timer)
                            console.log('快退')
                            if(this.imageLayer) {
                                this.imageLayer.hide()
                            }
                            
                            this.imageLayer = new AMap.ImageLayer({
                                url: 'http://' + this.radarList.imgUrl[this.imgIndex],
                                bounds: new AMap.Bounds(
                                    [southWest[0],southWest[1]],
                                    [northEast[0],northEast[1]]
                                ),
                                zooms: [1, 18], // 设置可见级别，[最小级别，最大级别]
                                map: this.map
                            })
                            
                            if(timer && this.isPlay) {
                                clearInterval(timer)
                                setTimeout(() => {
                                    clearInterval(timer)
                                    timer = setInterval(() => {
                                        this.imageLayer.hide()
                                        this.imgIndex -=1
                                        this.barWidth += 13.7
                                        bar.style.width = this.barWidth + '%'
                                        timeInitial.innerHTML = this.dateList[this.imgIndex]

                                        if(this.barWidth >= 96) {
                                            this.barWidth = 4
                                            this.barWidth -= 13.7
                                        }

                                        if(this.imgIndex < 0) {
                                            timeInitial.innerHTML = this.dateList[7]
                                            this.imgIndex = 7 // 重置下标
                                        }

                                        this.imageLayer = new AMap.ImageLayer({
                                            url: 'http://' + this.radarList.imgUrl[this.imgIndex],
                                            bounds: new AMap.Bounds(
                                                [southWest[0],southWest[1]],
                                                [northEast[0],northEast[1]]
                                            ),
                                            zooms: [1, 18], // 设置可见级别，[最小级别，最大级别]
                                            map: this.map
                                        })
                                    },1000)
                                },500)
                            }
                            this.imgIndex += 1
                            this.barWidth -= 13.7;
                            bar.style.width = this.barWidth + '%';
                            timeInitial.innerHTML = this.dateList[this.imgIndex]

                            if(this.barWidth <= 0) {
                                this.barWidth = 4
                            }
                            if(this.imgIndex > 7) {
                                timeInitial.innerHTML = this.dateList[this.imgIndex-1]
                                this.imgIndex = 7
                            }
                        })
                        // 给播放/暂停按键绑定点击函数
                        document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .container .row .player .icon-video-control').onclick = ( e => {
                            
                            
                            clearInterval(timer) // 每次点击后清除定时器再开始执行新的定时器
                            console.log('播放')
                            radarList().then(response => {
                                this.radarList = response.data // 所有雷达数据
                                this.dateList = this.radarList.dateList // 时间数据
                                console.log(this.radarList)
                                
                                // 将数据中经纬度字符串转换为数组
                                let getArray = str => {
                                    str = str.split(',')
                                    console.log(str)
                                    return str
                                }
                                // 接收数据中图层的西南和东北两个角的经纬度
                                let southWest = getArray(this.radarList.southWest)
                                let northEast = getArray(this.radarList.northEast)

                                // 将数据中时间数组的小时分钟分离开
                                let getHoursAndMinute = str => {
                                    str = str.substring(11,16)
                                    return str
                                }
                                let dateOne = getHoursAndMinute(this.dateList[7])
                                let dateTwo = getHoursAndMinute(this.dateList[6])
                                let dateThr = getHoursAndMinute(this.dateList[5])
                                let dateFou = getHoursAndMinute(this.dateList[4])
                                let dateFiv = getHoursAndMinute(this.dateList[3])
                                let dateSix = getHoursAndMinute(this.dateList[2])
                                let dateSev = getHoursAndMinute(this.dateList[1])
                                let dateEig = getHoursAndMinute(this.dateList[0])

                                // if(this.imageLayer) {
                                //     this.imageLayer.hide()
                                // }

                                

                                if(this.isPlay) {
                                    clearInterval(timer)
                                    document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .container .row .player .icon-ziyuan').className = 'iconfont icon-video-control'
                                    this.isPlay = false
                                } else {
                                    if(this.imageLayer) {
                                        this.imageLayer.hide()
                                    }
                                    // 初始化图片图层
                                    this.imageLayer = new AMap.ImageLayer({
                                        url: 'http://' + this.radarList.imgUrl[this.imgIndex],
                                        bounds: new AMap.Bounds(
                                            [southWest[0],southWest[1]],
                                            [northEast[0],northEast[1]]
                                        ),
                                        zooms: [1, 18], // 设置可见级别，[最小级别，最大级别]
                                        map: this.map
                                    })
                                    document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .container .row .player .icon-video-control').className = 'iconfont icon-ziyuan'
                                    timer = setInterval(() => {
                                        if(this.imageLayer) {
                                            this.imageLayer.hide()
                                        }
                                        this.imgIndex -=1
                                        this.barWidth += 13.7
                                        bar.style.width = this.barWidth + '%'
                                        timeInitial.innerHTML = this.dateList[this.imgIndex]

                                        if(this.barWidth >= 96) {
                                            this.barWidth = 4
                                            this.barWidth -= 13.7
                                        }

                                        if(this.imgIndex < 0) {
                                            timeInitial.innerHTML = this.dateList[7]
                                            this.imgIndex = 7 // 重置下标
                                        }

                                        this.imageLayer = new AMap.ImageLayer({
                                            url: 'http://' + this.radarList.imgUrl[this.imgIndex],
                                            bounds: new AMap.Bounds(
                                                [southWest[0],southWest[1]],
                                                [northEast[0],northEast[1]]
                                            ),
                                            zooms: [1, 18], // 设置可见级别，[最小级别，最大级别]
                                            map: this.map
                                        })
                                    },1000)
                                    this.isPlay = true
                                }

                            })
                        })
                        // 给快进按键绑定点击函数
                        document.querySelector('#wrapper .jsPanel-standard .jsPanel-content .container .row .player .icon-kuaijin').onclick = ( e => {

                            clearInterval(timer)
                            console.log('快进')
                            if(this.imageLayer) {
                                this.imageLayer.hide()
                                console.log('隐藏1')
                            }
                            this.imageLayer = new AMap.ImageLayer({
                                url: 'http://' + this.radarList.imgUrl[this.imgIndex],
                                bounds: new AMap.Bounds(
                                    [southWest[0],southWest[1]],
                                    [northEast[0],northEast[1]]
                                ),
                                zooms: [1, 18], // 设置可见级别，[最小级别，最大级别]
                                map: this.map
                            })
                            if(timer && this.isPlay) {
                                clearInterval(timer)
                                setTimeout(() => {
                                    clearInterval(timer)
                                    timer = setInterval(() => {
                                        if(this.imageLayer) {
                                            this.imageLayer.hide()
                                            console.log('隐藏2')
                                        }
                                        this.imgIndex -=1
                                        this.barWidth += 13.7
                                        bar.style.width = this.barWidth + '%'
                                        timeInitial.innerHTML = this.dateList[this.imgIndex]

                                        if(this.barWidth > 96) {
                                            this.barWidth = 4
                                            this.barWidth -= 13.7
                                        }

                                        if(this.imgIndex < 0) {
                                            timeInitial.innerHTML = this.dateList[7]
                                            this.imgIndex = 7 // 重置下标
                                        }

                                        this.imageLayer = new AMap.ImageLayer({
                                            url: 'http://' + this.radarList.imgUrl[this.imgIndex],
                                            bounds: new AMap.Bounds(
                                                [southWest[0],southWest[1]],
                                                [northEast[0],northEast[1]]
                                            ),
                                            zooms: [1, 18], // 设置可见级别，[最小级别，最大级别]
                                            map: this.map
                                        })
                                    },1000)
                                },500)
                            }
                            this.imgIndex -= 1
                            this.barWidth += 13.7;
                            bar.style.width = this.barWidth + '%';
                            timeInitial.innerHTML = this.dateList[this.imgIndex]

                            if(this.barWidth > 96) {
                                this.barWidth = 4
                                this.barWidth -= 13.7
                                
                            }

                            if(this.imgIndex < 0) {
                                timeInitial.innerHTML = this.dateList[7]
                                this.imgIndex = 7 // 重置下标
                            }
                        })
                    })                
            },
            
        }
    }
</script>

<style>
    #wrapper {
        height: 850px;
        width: 100%;
    } 

    #container {
        height: 100%;
        width: 100%;
    }  

    /* 内容总容器样式 */
    .jsPanel-standard{
        opacity: 0.8 !important;
    }

    /* 进度条样式 */
    .row{
        position: relative;
        margin-top: 48px;
    }
    /* 初始时间 */
    .timeInitial {
        width: auto;
        height: auto;
        margin: -23px 0px 0px -160px;
        color: #5A5A5A;
        font-weight: bold;
        text-align: center;
    }

    .row .player{
        /* transform: translate(10px,10px); */
        position: absolute;
        right: 0;
        width: 30%;
        height: auto;
        margin-top: -70px;
    }
    .row .player .iconfont{
        font-size: 35px;
        color: #2B82E5;
    }
    .progress-title{
        font-size: 18px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 20px;
    }
    /* 包裹进度条容器 */
    .progress{
        height: 20px;
        background: #171b3c;
        border-radius: 20px;
        border: 1px solid #000;
        box-shadow: 0 2px 2px #4f4c4c;
        margin-bottom: 40px;
        overflow: visible;
        position: relative;
        width: 66%;
        margin-left: 15px;
    }
    /* 填充进度条 */
    .progress .progress-bar{
        background: #2B82E5;
        border-radius: 20px;
        border:  1px solid #000;
        -webkit-animation: animate-positive 2s;
        animation: animate-positive 2s;
        width: 4%;
        height: 20px;
    }
    .progress .progress-value{
        width: 65px;
        height: 25px;
        line-height: 25px;
        background: #171b3c;
        font-size: 15px;
        color: #fff;
        border-radius: 0 0 15px 15px;
        border: 1px solid #000;
        border-top: none;
        box-shadow: 0 2px 2px #4f4c4c;
        position: absolute;
        bottom: -25px;
        right: 60px;
    }
    @-webkit-keyframes animate-positive{
        0% { width: 0; }
    }
    @keyframes animate-positive{
        0% { width: 0; }
    }

    /* 时间轴样式 */
    .numberTime {
        width: 100%;
        height: auto;
        position: absolute;
        transform: translate(10px,10px);
    }
    /* 时间轴文字样式 */
    .numberTime span{
        font-size: 15px;
        color: #787878;
    }


</style>