layui.use(['upload', 'jquery', 'layer'], function () {
    var $ = layui.jquery;
    var layer = layui.layer;
    var jsChart = echarts.init(document.getElementById('china_js'));
    //注册地图点击事件
    mapClick();
    //初始化江苏省地图数据
    drawMap("江苏省");

    // jsChart.on('georoam', function (params) {
    //     console.log(params);
    // });

    /**
     * 加载地图展示数据
     * @param city 城市
     */
    function drawMap(city) {
        jsChart.showLoading();
        var url = '../json/data/' + city + '.json';
        $.getJSON(url, function (res) {
            registerMap(city, res.data);
        })

    }

    /**
     * echart 点击事件
     */
    function mapClick() {
        jsChart.on('click', function (object) {
            console.log(object);
            var cityName = object.name;
            var seriesName = object.seriesName;
            if (seriesName == "江苏省") {
                //南京例子
                drawMap(cityName);
            } else {
                // layer.msg("已下钻到最低级别");
                drawMap("江苏省");
            }

        });
    }

    /**
     * 注册地图
     * @param city
     * @param data
     */
    function registerMap(city, data) {

        var url = '../json/江苏/' + city + '.json';
        $.getJSON(url, function (mapJson) {
            jsChart.hideLoading();
            echarts.registerMap(city, mapJson, {});
            loadMap(city, data);
        })

    }

    /**
     * 加载地图
     * @param city
     * @param data
     */
    function loadMap(city, data) {
        var option = {
            title: {
                text: city,
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                formatter: function (params) {
                	console.log(params.name)
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                    return params.seriesName + '<br/>' + params.name + ': ' + value;
                }
            },
            visualMap: {
                left: 'right',
                min: 0,
                max: 10000,
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                },
                text: ['High', 'Low'],           // 文本，默认为数值文本
                calculable: true
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'top',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
          
            series: [
                {
                    name: city,
                    type: 'map',
                    roam: 'scale',//不可以拖动,此项配合下面的scaleLimit可以实现地图的缩放功能,是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                    map: city, //已经注册的地图组件的名字
                    scaleLimit:{
                        min:1,
                        max:5
                    },
                    label: {
                        show: true, //地图上是否显示区域名字
                        position: 'insideTop',
                        fontSize: 13,
                        // align: 'left',
                        // offset:[3350,400],
                        // rich: {
                        //     a: {
                        //         // 没有设置 `align`，则 `align` 为 right
                        //     }
                        // }
                    }, //图形上的文本标签，
                    itemStyle: {},//地图普通状态下样式
                    emphasis: {},//地图高亮时候样式
                    // 文本位置修正
                    // textFixed: {
                    //     Alaska: [20, -20]
                    // },
                    data: data
                }
            ]
        };
        jsChart.setOption(option);
    }
});