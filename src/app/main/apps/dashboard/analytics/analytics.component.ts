import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { AnalyticsDashboardService } from 'app/main/apps/dashboard/analytics/analytics.service';

@Component({
    selector: 'analytics-dashboard',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit {
    widgets: any;
    widgetYears = [];
    widget1SelectedYear = '';
    widget5SelectedDay = 'today';
    login: any;

    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        private _analyticsDashboardService: AnalyticsDashboardService,
        private changeDetector: ChangeDetectorRef
    ) {
        // Register the custom chart.js plugin
        this._registerCustomChartJSPlugin();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the widgets from the service
        this.widgets = {
            widget1: {
                chartType: 'line',
                datasets: {},
                labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                colors: [
                    {
                        borderColor: '#42a5f5',
                        backgroundColor: '#42a5f5',
                        pointBackgroundColor: '#1e88e5',
                        pointHoverBackgroundColor: '#1e88e5',
                        pointBorderColor: '#ffffff',
                        pointHoverBorderColor: '#ffffff'
                    }
                ],
                options: {
                    spanGaps: false,
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 32,
                            left: 32,
                            right: 32
                        }
                    },
                    elements: {
                        point: {
                            radius: 4,
                            borderWidth: 2,
                            hoverRadius: 4,
                            hoverBorderWidth: 2
                        },
                        line: {
                            tension: 0
                        }
                    },
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    display: false,
                                    drawBorder: false,
                                    tickMarkLength: 18
                                },
                                ticks: {
                                    fontColor: '#ffffff'
                                }
                            }
                        ],
                        yAxes: [
                            {
                                display: true,
                                ticks: {
                                    // min: 1.5,
                                    // max: 5,
                                    // stepSize: 0.001
                                    fontColor: '#ffffff'
                                }
                            }
                        ]
                    },
                    plugins: {
                        filler: {
                            propagate: false
                        },
                        xLabelsOnTop: {
                            active: false
                        }
                    }
                }
            },
            widget2: {
                values: {
                    value: 492,
                    ofTarget: 13
                },
                chartType: 'bar',
                datasets: [
                    {
                        label: 'Conversion',
                        data: []
                    }
                ],
                labels: [],
                colors: [
                    {
                        borderColor: '#42a5f5',
                        backgroundColor: '#42a5f5'
                    }
                ],
                options: {
                    spanGaps: false,
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 24,
                            left: 16,
                            right: 16,
                            bottom: 16
                        }
                    },
                    scales: {
                        xAxes: [
                            {
                                display: false
                            }
                        ],
                        yAxes: [
                            {
                                display: false,
                                ticks: {
                                    // min: 100,
                                    // max: 500
                                }
                            }
                        ]
                    }
                }
            },
            widget3: {
                values: {
                    value: '0',
                    ofTarget: 0
                },
                chartType: 'line',
                datasets: [
                    {
                        label: 'Impression',
                        data: [],
                        fill: false
                    }
                ],
                labels: [],
                colors: [
                    {
                        borderColor: '#5c84f1'
                    }
                ],
                options: {
                    spanGaps: false,
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    elements: {
                        point: {
                            radius: 2,
                            borderWidth: 1,
                            hoverRadius: 2,
                            hoverBorderWidth: 1
                        },
                        line: {
                            tension: 0
                        }
                    },
                    layout: {
                        padding: {
                            top: 24,
                            left: 16,
                            right: 16,
                            bottom: 16
                        }
                    },
                    scales: {
                        xAxes: [
                            {
                                display: false
                            }
                        ],
                        yAxes: [
                            {
                                display: false,
                                ticks: {
                                    // min: 100,
                                    // max: 500
                                }
                            }
                        ]
                    }
                }
            },
            widget4: {
                values: {
                    value: 0,
                    ofTarget: 0
                },
                chartType: 'bar',
                datasets: [
                    {
                        label: 'Downloads',
                        data: []
                    }
                ],
                labels: [],
                colors: [
                    {
                        borderColor: '#f44336',
                        backgroundColor: '#f44336'
                    }
                ],
                options: {
                    spanGaps: false,
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 24,
                            left: 16,
                            right: 16,
                            bottom: 16
                        }
                    },
                    scales: {
                        xAxes: [
                            {
                                display: false
                            }
                        ],
                        yAxes: [
                            {
                                display: false,
                                ticks: {
                                    min: 0,
                                    max: 500
                                }
                            }
                        ]
                    }
                }
            }
        };
        console.log(this.widgets.widget1.datasets);


        // Visitors
        const visitors = { start: '2018-11-1' };
        this._analyticsDashboardService.getVisitors(visitors).subscribe(data => {
            if (data.status === 200) {
                console.log(data);
                const datasets = {};
                data['data'].months.forEach(item => {
                    if (!datasets[item._id.year]) {
                        datasets[item._id.year] = [{}];
                        datasets[item._id.year][0]['data'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        datasets[item._id.year][0]['label'] = 'Visitors';
                        datasets[item._id.year][0]['fill'] = 'start';
                    }
                    datasets[item._id.year][0]['data'][item._id.month - 1] = item.counts;
                });
                this.widgets.widget1.datasets = datasets;
                this.widgetYears = Object.keys(this.widgets.widget1.datasets);
                console.log(this.widgets.widget1.datasets);
                this.widget1SelectedYear = this.widgetYears[0];
                this.changeDetector.detectChanges();
            }
        });

        // Logins
        const logins = { start: '2018-11-1', action: 'login' };
        this._analyticsDashboardService.getLogs(logins).subscribe(data => {
            if (data.status === 200) {
                console.log(data);
                this.widgets.widget2.values.value = data['data'].total;
                if (data['data'].days.length > 1) {
                    this.widgets.widget2.values.ofTarget = data['data'].days[0].counts - data['data'].days[1].counts;
                } else {
                    this.widgets.widget2.values.ofTarget = 0;
                }
                const labels = [], datasets = [];
                let max = 0;
                data['data'].days.forEach(day => {
                    labels.push(`${day._id.year}-${day._id.month}-${day._id.dayOfMonth}`);
                    datasets.push(day.counts);
                    max = max < day.counts ? day.counts : max;
                });
                this.widgets.widget2.labels = labels;
                this.widgets.widget2.datasets[0].data = datasets;
                this.widgets.widget2.options.scales.yAxes[0].ticks.max = max;
                console.log(max);
                this.changeDetector.detectChanges();
            }
        });

        // Impressions
        const impressions = { start: '2018-11-1' };
        this._analyticsDashboardService.getLogs(impressions).subscribe(data => {
            if (data.status === 200) {
                console.log(data);
                this.widgets.widget3.values.value = data['data'].total;
                if (data['data'].days.length > 1) {
                    this.widgets.widget3.values.ofTarget = data['data'].days[0].counts - data['data'].days[1].counts;
                } else {
                    this.widgets.widget3.values.ofTarget = 0;
                }
                const labels = [], datasets = [];
                let max = 0;
                data['data'].days.forEach(day => {
                    labels.push(`${day._id.year}-${day._id.month}-${day._id.dayOfMonth}`);
                    datasets.push(day.counts);
                    max = max < day.counts ? day.counts : max;
                });
                this.widgets.widget3.labels = labels;
                this.widgets.widget3.datasets[0].data = datasets;
                this.widgets.widget3.options.scales.yAxes[0].ticks.max = max;
                console.log(max);
                this.changeDetector.detectChanges();
            }
        });


        // Downloads
        const downloads = { start: '2018-11-1', action: 'download' };
        this._analyticsDashboardService.getLogs(downloads).subscribe(data => {
            if (data.status === 200) {
                console.log(data);
                this.widgets.widget4.values.value = data['data'].total;
                if (data['data'].days.length > 1) {
                    this.widgets.widget4.values.ofTarget = data['data'].days[0].counts - data['data'].days[1].counts;
                } else {
                    this.widgets.widget4.values.ofTarget = 0;
                }
                const labels = [], datasets = [];
                let max = 0;
                data['data'].days.forEach(day => {
                    labels.push(`${day._id.year}-${day._id.month}-${day._id.dayOfMonth}`);
                    datasets.push(day.counts);
                    max = max < day.counts ? day.counts : max;
                });
                this.widgets.widget4.labels = labels;
                this.widgets.widget4.datasets[0].data = datasets;
                this.widgets.widget4.options.scales.yAxes[0].ticks.max = max;
                console.log(max);
                this.changeDetector.detectChanges();
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register a custom plugin
     */

    sendEmail() {
        this._analyticsDashboardService.sendemail().
            subscribe((re) => console.log(re));

    }
    private _registerCustomChartJSPlugin(): void {
        (<any>window).Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing) {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                ) {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i) {
                    const meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index) {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString() + 'k';

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }
}

