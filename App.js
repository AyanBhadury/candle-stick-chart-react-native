import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Platform } from 'react-native';
import FusionCharts from 'react-native-fusioncharts';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'timeseries',
      width: '100%',
      height: '100%',
      dataFormat: 'json',
      dataSource: {
        caption: {
          text: "Apple Inc. Stock Price"
        },
        data: null,
        subcaption: {
          text: "Stock prices from May 2014 - November 2018"
        },
        chart: {
          exportenabled: 1,
          multicanvas: false,
          theme: "candy"
        },
        yaxis: [
          {
            plot: [
              {
                value: {
                  open: "Open",
                  high: "High",
                  low: "Low",
                  close: "Close"
                },
                type: "candlestick"
              }
            ],
            format: {
              prefix: "$"
            },
            title: "Stock Price"
          },
          {
            plot: [
              {
                value: "Volume",
                type: "column"
              }
            ],
            max: "900000000"
          }
        ],
        datamarker: [
          {
            value: "Open",
            time: "08-Feb-2018",
            type: "pin",
            identifier: "L",
            timeformat: "%d-%b-%Y",
            tooltext: "Lowest close value - 2018"
          },
          {
            value: "Volume",
            time: "14-Sep-2016",
            type: "pin",
            identifier: "H",
            timeformat: "%d-%b-%Y",
            tooltext: "Over 110 M shares were traded."
          }
        ],
        xaxis: {
          plot: "Time",
          timemarker: [
            {
              start: "08-Feb-2018",
              end: "03-Jan-2017",
              label: "Growing era of Apple Inc. stock",
              timeformat: "%d-%b-%Y",
              type: "full"
            }
          ]
        },
        navigator: {
          enabled: 0
        }
      },
      schemaJson: null,
      dataJson: null
    };

    this.libraryPath = Platform.select({
      // Specify fusioncharts.html file location
      // ios: require('./assets/fusioncharts.html'),
      android: { uri: 'file:///android_asset/fusioncharts.html' }
    });
  }

  componentDidMount() {
    this.fetchDataAndSchema();
  }

  fetchDataAndSchema() {
    const jsonify = res => res.json();
    const dFetch = fetch(
      'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/annotations-on-stock-chart_data.json'
    ).then(jsonify);
    // This is the remote url to fetch the schema.
    const sFetch = fetch(
      'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/annotations-on-stock-chart_schema.json'
    ).then(jsonify);
    Promise.all([dFetch, sFetch]).then(res => {
      const data = res[0];
      const schema = res[1];
      console.log(data);
      console.log(schema);
      this.setState({ dataJson: data, schemaJson: schema });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          FusionCharts Integration with React Native
        </Text>
        <View style={styles.chartContainer}>
          <FusionCharts
            dataJson={this.state.dataJson}
            schemaJson={this.state.schemaJson}
            type={this.state.type}
            width={this.state.width}
            height={this.state.height}
            dataFormat={this.state.dataFormat}
            dataSource={this.state.dataSource}
            libraryPath={this.libraryPath} // set the libraryPath property
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  chartContainer: {
    height: 500
  }
});