<!--
 * @Author: your name
 * @Date: 2020-05-06 09:29:04
 * @LastEditTime: 2020-05-24 15:22:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ruoyi-ui\src\components\AMap\index.vue
 -->
<template>
    <div id='wrapper'>
        <div id="container">
        </div>
    </div>         
</template>

<script>
    import { weatherList } from '@/api/weather/location.js';
    import { jsPanel } from 'jspanel4'
    export default {
        data() {
            return {
                map: null, // 地图实例
                marker: null, // 雨滴实例
                markerIcon: null, // 雨滴图标实例
                weatherData: {}, // 定点天气数据
                jspanel: null, // 浮动窗口
                queryParams: {},
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
                    zoom: 13,
                });

                // 监听地图点击事件
                AMap.event.addListener(this.map, "click", (e) => {
                    console.log('点击了')
                    this.toGetAll(e)
                    if(this.jspanel) {
                        // this.jspanel.close()
                        
                    }
                });

            },
            toGetAll(e) {
                // console.log(this)
                // console.log(this.weatherData)
                // 请求参数
                this.queryParams = {
                    "longitude": e.lnglat.getLng(),
                    "dimension": e.lnglat.getLat()
                };
                
                // 调用数据请求函数
                weatherList(this.queryParams).then(response => {
                    // 将返回的数据存入weatherData中
                    this.weatherData = response.data
                    console.log(this.weatherData)

                    // 当地图上已存在marker时,删掉已存在的marker
                    if (this.marker) {
                        this.map.remove(this.marker)
                    }

                    // 自定义雨滴图标
                    this.markerIcon = new AMap.Icon({
                        imageSize: new AMap.Size(35, 35),
                        image: 'https://img.icons8.com/ultraviolet/48/000000/marker.png'
                    });

                    // 创建雨滴实例    
                    this.marker = new AMap.Marker({
                        position: e.lnglat,
                        icon: this.markerIcon,
                        map: this.map,
                        offset: new AMap.Pixel(-17,-37)
                    });

                    // 创建窗体内容的函数
                    function createInfoWindow(weatherData) {
                        // console.log(weatherData)
                        var info = document.createElement('div')
                        info.className = 'infoClass'
                        info.style.width = '800px'
                        info.style.height = '400px'
                        info.style.border = '1px solid sliver'
                        info.style.background = 'rgba(255,255,254,0.6)'
                        info.style.boxShadow = 'inherit'
                        info.style.position  = 'relative'
                        

                        var top = document.createElement('div')
                        top.style.width = '100%'
                        top.style.height = '16%'
                        // top.style.position = 'relative'
                        top.style.backgroundColor = 'rgb(61,141,228)'
                        top.style.float = 'left'
                        top.style.borderRadius = '5px 5px 0 0'
                        top.style.cursor = 'move'
                        // 拖拽窗体
                        top.onmousedown = function dropInfoWindow(e) {
                            console.log('被拖拽了')
                            e = e || window.event
                            // 当鼠标按下的时候，求鼠标在盒子中的位置
                            // 鼠标在盒子中的位置 = 鼠标在页面上的位置 - 盒子的位置
                            var x = getPage(e).pageX - info.offsetLeft;
                            var y = getPage(e).pageY - info.offsetTop;

                            // 鼠标在文档中移动
                            document.onmousemove = function(e) {
                                e = e || window.event
                                // 当鼠标在页面上移动的时候。求盒子的坐标
                                // 盒子的坐标 = 鼠标当前在页面中的位置 - 鼠标在盒子中的位置
                                var boxX = getPage(e).pageX - x;
                                var boxY = getPage(e).pageY - y;

                                info.style.left = boxX + 'px';
                                info.style.top = boxY + 'px'
                            }

                            // 当鼠标弹起时移除3鼠标移动事件
                            document.onmouseup = function () {
                                document.onmousemove = null
                            }
                        }

                        // 获取页面滚动出去的距离
                        function getScroll() {
                            var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                            return {
                                scrollLeft: scrollLeft,
                                scrollTop: scrollTop
                            }
                        }


                        // 获取鼠标在页面的位置
                        function getPage(e) {
                            var pageX = e.pageX || e.clientX + getScroll().scrollLeft;
                            var pageY = e.pageY || e.clientY + getScroll().scrollTop;
                            return {
                                pageX: pageX,
                                pageY: pageY
                            }
                        } 
                    

                        var topDiv = document.createElement('div')
                        topDiv.style.cursor = 'default'
                        topDiv.style.width = 'auto'
                        topDiv.style.height = '5%'
                        topDiv.style.marginTop = '3%'
                        topDiv.style.marginLeft = '5%'
                        topDiv.style.color = 'white'
                        topDiv.style.float = 'left'
                        topDiv.innerHTML = '定点天气查询'

                        var topImg = document.createElement('i')
                        // topImg.src = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3808414494,2416757507&fm=26&gp=0.jpg'
                        topImg.className = 'iconfont icon-guanbicuowu'
                        topImg.alt = '关闭按钮'
                        topImg.style.cursor = 'default'
                        // topImg.style.width = '7.4%'
                        // topImg.style.height = '7.4%'
                        topImg.style.marginTop = '3%'
                        topImg.style.marginRight = '3%'
                        topImg.style.float = 'right'
                        // topImg.style.borderRadius = '50%'
                        topImg.style.color = 'rgb(255,255,255)'
                        topImg.onclick = closeInfoWindow

                        top.appendChild(topDiv)
                        top.appendChild(topImg)
                        info.appendChild(top)

                        var middleTable = document.createElement('table')
                        middleTable.style.borderCollapse = 'collapse'
                        middleTable.style.width = '87.5%'
                        middleTable.style.height = '67.5%'
                        middleTable.style.position = 'absolute'
                        middleTable.style.border = '1px solid black'
                        middleTable.style.top = '50%'
                        middleTable.style.left = '50%'
                        middleTable.style.transform = 'translate(-50%,-39%)'

                        middleTable.style.backgroundColor = 'rgb(255,255,254)'


                        var middleTbody = document.createElement('tbody')
                        middleTbody.style.width = '100%'
                        middleTbody.style.height = '100%'
                        // 第一个tr
                        var middleTr1 = document.createElement('tr')
                        var middleTr1Td1 = document.createElement('td')
                        middleTr1Td1.style.color = 'rgb(100,100,100)'
                        middleTr1Td1.innerHTML = '自动站名称'
                        middleTr1Td1.style.border = '1px solid rgb(225,225,225)'
                        middleTr1Td1.style.width = '9.3%'
                        middleTr1Td1.style.height = '7.4%'
                        middleTr1Td1.style.textAlign = 'center'

                        var middleTr1Td2 = document.createElement('td')
                        middleTr1Td2.style.color = 'rgb(100,100,100)'
                        middleTr1Td2.innerHTML = weatherData.name
                        middleTr1Td2.style.border = '1px solid rgb(225,225,225)'
                        middleTr1Td2.style.width = '9.3%'
                        middleTr1Td2.style.height = '7.4%'
                        middleTr1Td2.style.padding = '0'
                        middleTr1Td2.style.textAlign = 'center'

                        var middleTr1Td3 = document.createElement('td')
                        middleTr1Td3.style.color = 'rgb(100,100,100)'
                        middleTr1Td3.innerHTML = '数据时间'
                        middleTr1Td3.style.border = '1px solid rgb(225,225,225)'
                        middleTr1Td3.style.width = '9.3%'
                        middleTr1Td3.style.height = '7.4%'
                        middleTr1Td3.style.padding = '0'
                        middleTr1Td3.style.textAlign = 'center'

                        var middleTr1Td4 = document.createElement('td')
                        middleTr1Td4.style.color = 'rgb(100,100,100)'
                        middleTr1Td4.innerHTML = weatherData.monitorDate
                        middleTr1Td4.style.border = '1px solid rgb(225,225,225)'
                        middleTr1Td4.style.width = '9.3%'
                        middleTr1Td4.style.height = '7.4%'
                        middleTr1Td4.style.padding = '0'
                        middleTr1Td4.style.textAlign = 'center'

                        middleTr1.appendChild(middleTr1Td1)
                        middleTr1.appendChild(middleTr1Td2)
                        middleTr1.appendChild(middleTr1Td3)
                        middleTr1.appendChild(middleTr1Td4)

                        middleTbody.appendChild(middleTr1)

                        // 第二个tr
                        var middleTr2 = document.createElement('tr')
                        var middleTr2Td1 = document.createElement('td')
                        middleTr2Td1.style.color = 'rgb(100,100,100)'
                        middleTr2Td1.innerHTML = '温度(°C)'
                        middleTr2Td1.style.border = '1px solid rgb(225,225,225)'
                        middleTr2Td1.style.width = '9.3%'
                        middleTr2Td1.style.height = '7.4%'
                        middleTr2Td1.style.padding = '0'
                        middleTr2Td1.style.textAlign = 'center'
                        var middleTr2Td2 = document.createElement('td')
                        middleTr2Td2.style.color = 'rgb(100,100,100)'
                        middleTr2Td2.innerHTML = weatherData.temp
                        middleTr2Td2.style.border = '1px solid rgb(225,225,225)'
                        middleTr2Td2.style.width = '9.3%'
                        middleTr2Td2.style.height = '7.4%'
                        middleTr2Td2.style.padding = '0'
                        middleTr2Td2.style.textAlign = 'center'
                        var middleTr2Td3 = document.createElement('td')
                        middleTr2Td3.style.color = 'rgb(100,100,100)'
                        middleTr2Td3.innerHTML = '相对湿度(°C)'
                        middleTr2Td3.style.border = '1px solid rgb(225,225,225)'
                        middleTr2Td3.style.width = '9.3%'
                        middleTr2Td3.style.height = '7.4%'
                        middleTr2Td3.style.padding = '0'
                        middleTr2Td3.style.textAlign = 'center'
                        var middleTr2Td4 = document.createElement('td')
                        middleTr2Td4.style.color = 'rgb(100,100,100)'
                        middleTr2Td4.innerHTML = weatherData.humid
                        middleTr2Td4.style.border = '1px solid rgb(225,225,225)'
                        middleTr2Td4.style.width = '9.3%'
                        middleTr2Td4.style.height = '7.4%'
                        middleTr2Td4.style.padding = '0'
                        middleTr2Td4.style.textAlign = 'center'

                        middleTr2.appendChild(middleTr2Td1)
                        middleTr2.appendChild(middleTr2Td2)
                        middleTr2.appendChild(middleTr2Td3)
                        middleTr2.appendChild(middleTr2Td4)

                        middleTbody.appendChild(middleTr2)

                        
                        // 第三个tr
                        var middleTr3 = document.createElement('tr')
                        var middleTr3Td1 = document.createElement('td')
                        middleTr3Td1.style.color = 'rgb(100,100,100)'
                        middleTr3Td1.innerHTML = '能见度(m)'
                        middleTr3Td1.style.border = '1px solid rgb(225,225,225)'
                        middleTr3Td1.style.width = '9.3%'
                        middleTr3Td1.style.height = '7.4%'
                        middleTr3Td1.style.padding = '0'
                        middleTr3Td1.style.textAlign = 'center'
                        var middleTr3Td2 = document.createElement('td')
                        middleTr3Td2.style.color = 'rgb(100,100,100)'
                        middleTr3Td2.innerHTML = weatherData.visibility
                        middleTr3Td2.style.border = '1px solid rgb(225,225,225)'
                        middleTr3Td2.style.width = '9.3%'
                        middleTr3Td2.style.height = '7.4%'
                        middleTr3Td2.style.padding = '0'
                        middleTr3Td2.style.textAlign = 'center'
                        var middleTr3Td3 = document.createElement('td')
                        middleTr3Td3.style.color = 'rgb(100,100,100)'
                        middleTr3Td3.innerHTML = '小时雨量(mm)'
                        middleTr3Td3.style.border = '1px solid rgb(225,225,225)'
                        middleTr3Td3.style.width = '9.3%'
                        middleTr3Td3.style.height = '7.4%'
                        middleTr3Td3.style.padding = '0'
                        middleTr3Td3.style.textAlign = 'center'
                        var middleTr3Td4 = document.createElement('td')
                        middleTr3Td4.style.color = 'rgb(100,100,100)'
                        middleTr3Td4.innerHTML = weatherData.rainfall
                        middleTr3Td4.style.border = '1px solid rgb(225,225,225)'
                        middleTr3Td4.style.width = '9.3%'
                        middleTr3Td4.style.height = '7.4%'
                        middleTr3Td4.style.padding = '0'
                        middleTr3Td4.style.textAlign = 'center'

                        middleTr3.appendChild(middleTr3Td1)
                        middleTr3.appendChild(middleTr3Td2)
                        middleTr3.appendChild(middleTr3Td3)
                        middleTr3.appendChild(middleTr3Td4)
                        
                        middleTbody.appendChild(middleTr3)

                        // 第四个tr
                        var middleTr4 = document.createElement('tr')
                        var middleTr4Td1 = document.createElement('td')
                        middleTr4Td1.style.color = 'rgb(100,100,100)'
                        middleTr4Td1.innerHTML = '风力(m/s)'
                        middleTr4Td1.style.border = '1px solid rgb(225,225,225)'
                        middleTr4Td1.style.width = '9.3%'
                        middleTr4Td1.style.height = '7.4%'
                        middleTr4Td1.style.padding = '0'
                        middleTr4Td1.style.textAlign = 'center'
                        var middleTr4Td2 = document.createElement('td')
                        middleTr4Td2.style.color = 'rgb(100,100,100)'
                        middleTr4Td2.innerHTML = weatherData.windSpeed
                        middleTr4Td2.style.border = '1px solid rgb(225,225,225)'
                        middleTr4Td2.style.width = '9.3%'
                        middleTr4Td2.style.height = '7.4%'
                        middleTr4Td2.style.padding = '0'
                        middleTr4Td2.style.textAlign = 'center'
                        var middleTr4Td3 = document.createElement('td')
                        middleTr4Td3.style.color = 'rgb(100,100,100)'
                        middleTr4Td3.innerHTML = '风向(度)'
                        middleTr4Td3.style.border = '1px solid rgb(225,225,225)'
                        middleTr4Td3.style.width = '9.3%'
                        middleTr4Td3.style.height = '7.4%'
                        middleTr4Td3.style.padding = '0'
                        middleTr4Td3.style.textAlign = 'center'
                        var middleTr4Td4 = document.createElement('td')
                        middleTr4Td4.style.color = 'rgb(100,100,100)'
                        middleTr4Td4.innerHTML = weatherData.windDirection
                        middleTr4Td4.style.border = '1px solid rgb(225,225,225)'
                        middleTr4Td4.style.width = '9.3%'
                        middleTr4Td4.style.height = '7.4%'
                        middleTr4Td4.style.padding = '0'
                        middleTr4Td4.style.textAlign = 'center'

                        middleTr4.appendChild(middleTr4Td1)
                        middleTr4.appendChild(middleTr4Td2)
                        middleTr4.appendChild(middleTr4Td3)
                        middleTr4.appendChild(middleTr4Td4)

                        middleTbody.appendChild(middleTr4)

                        // 第五个tr
                        var middleTr5 = document.createElement('tr')
                        var middleTr5Td1 = document.createElement('td')
                        middleTr5Td1.style.color = 'rgb(100,100,100)'
                        middleTr5Td1.innerHTML = '天气实况'
                        middleTr5Td1.style.border = '1px solid rgb(225,225,225)'
                        middleTr5Td1.style.width = '9.3%'
                        middleTr5Td1.style.height = '7.4%'
                        middleTr5Td1.style.padding = '0'
                        middleTr5Td1.style.textAlign = 'center'
                        var middleTr5Td2 = document.createElement('td')
                        middleTr5Td2.style.color = 'rgb(100,100,100)'
                        middleTr5Td2.colSpan = '3'
                        middleTr5Td2.innerHTML = weatherData.weather
                        middleTr5Td2.style.border = '1px solid rgb(225,225,225)'
                        middleTr5Td2.style.width = '255px'
                        middleTr5Td2.style.height = '7.4%'
                        middleTr5Td2.style.padding = '0'
                        middleTr5Td2.style.textAlign = 'center'

                        middleTr5.appendChild(middleTr5Td1)
                        middleTr5.appendChild(middleTr5Td2)

                        middleTbody.appendChild(middleTr5)

                        middleTable.appendChild(middleTbody)
                        // middle.appendChild(middleTable)

                        info.appendChild(middleTable)

                        return info 
                    }

                    // 创建信息窗体实例
                    var infoWindow = new AMap.InfoWindow({
                        isCustom: true,  //使用自定义窗体
                        // content: '创建自定义信息窗体成功',
                        content: createInfoWindow(this.weatherData),
                        offset: new AMap.Pixel(16, -45),
                        showShadow: true,
                        autoMove: true,
                        closeWhenClickMap: true
                    });

                    AMap.event.addListener(this.marker,'click',(e) => {
                        // 打开信息窗体
                        infoWindow.open(this.map, this.marker.getPosition())
                    })

                    // 打开信息窗体
                    infoWindow.open(this.map, this.marker.getPosition())

                    // 关闭窗体
                    function closeInfoWindow() {
                        console.log('关闭窗体')
                        infoWindow.close()
                    } 


                    
                });
                
            }
        }
    }
</script>

<style scoped>
    #wrapper {
        height: 850px;
        width: 100%;
    } 

    #container {
        height: 100%;
        width: 100%;
    }  
</style>