import React from 'react';
import { Text, View, Dimensions, TouchableOpacity, Image, ActivityIndicator, Clipboard } from 'react-native';
import { BarCodeScanner, Permissions, AdMobBanner, Font } from 'expo';
import { Button } from 'native-base';

const { width, height } = Dimensions.get('window');

export default class Barcode extends React.Component {
  state = {
    hasCameraPermission: null,
    barcodeType: null,
    barcodeData: null,
    startBarcode: false,
    didScan: false,
    loading: true
  }

  async componentWillMount() {
    await Font.loadAsync({
      bebas: require('./fonts/BebasNeue-Regular.otf')
    });
    await Font.loadAsync({
      barcode: require('./fonts/BarcodeFont.ttf')
    });

    this.setState({ loading: false });
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  handleBarCodeScanned = ({ type, data }) => {
    let barType = type;
    if (barType === 'org.iso.QRCode') {
      barType = 'QR Code';
    }
    this.setState({ didScan: true, barcodeData: data, barcodeType: barType });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          this.state.loading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='large' />
          </View>
          :
          <View style={{ flex: 1 }}>
            {
              this.state.startBarcode ?
              <View style={{ flex: 1 }}>
                {
                  this.state.didScan ?
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ width: width, height: height / 2, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.setState({ didScan: false })}>
                      <View style={{ marginTop: 20, backgroundColor: '#3B5998', width: width - 60, alignItems: 'center', padding: 10, borderRadius: 4 }}>
                        <Text style={{ color: 'white', fontSize: 50, fontFamily: 'barcode' }}>Scan Again</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: width, height: (height / 2) - 32, alignItems: 'center' }}>
                  <Button full success>
                    <Text style={{ color: 'white', fontSize: 15, fontFamily: 'bebas' }}>Scanned</Text>
                  </Button>
                  <Button full primary style={{ marginTop: 5 }}>
                    <Text style={{ fontFamily: 'bebas', fontSize: 20, color: 'white' }}>Barcode Data</Text>
                  </Button>
                  <Button full succes style={{ marginTop: 5 }}>
                    <Text style={{ fontFamily: 'bebas', color: 'white' }}>{this.state.barcodeData}</Text>
                  </Button>
                  <Button full danger style={{ marginTop: 5 }}>
                    <Text style={{ fontFamily: 'bebas', color: 'white' }}>Barcode Type : {this.state.barcodeType}</Text>
                  </Button>
                  <Button full warning style={{ marginTop: 5 }} onPress={() => { Clipboard.setString(this.state.barcodeData); }}>
                    <Text style={{ fontFamily: 'bebas', color: 'white' }}>Copy to Clipboard</Text>
                  </Button>
                </View>
              </View>
              :
              <View style={{ flex: 1, alignItems: 'center' }}>
                <BarCodeScanner
                  onBarCodeScanned={this.handleBarCodeScanned}
                  style={{ width: width, height: height / 2 }}
                />
                <View style={{ width: width, height: (height / 2) - 32, alignItems: 'center' }}>
                <Button full danger>
                  <Text style={{ color: 'white', fontSize: 15, fontFamily: 'bebas' }}>Not Scanned</Text>
                </Button>
                <View style={{ marginTop: 10, width: width }}>
                  <Button full info style={{ marginTop: 5 }}>
                    <Text style={{ fontSize: 15, fontFamily: 'bebas', color: 'white' }}>- Open the camera</Text>
                  </Button>
                  <Button full info style={{ marginTop: 5 }}>
                    <Text style={{ fontSize: 15, fontFamily: 'bebas', color: 'white' }}>- Scan the QR Code</Text>
                  </Button>
                  <Button full info style={{ marginTop: 5 }}>
                    <Text style={{ fontSize: 15, fontFamily: 'bebas', color: 'white' }}>- Wait for the result</Text>
                  </Button>
                  <Button full info style={{ marginTop: 5 }}>
                    <Text style={{ fontSize: 15, fontFamily: 'bebas', color: 'white' }}>- Easy and Simple</Text>
                  </Button>
                </View>
              </View>
            </View>
          }
        </View>
        :
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('./images/main.gif')}
            style={{ width: width - 40, height: width - 40 }}
          />
          <TouchableOpacity onPress={() => this.setState({ startBarcode: true })}>
            <View style={{ marginTop: 20, backgroundColor: '#3B5998', width: width - 60, alignItems: 'center', padding: 10, borderRadius: 4 }}>
              <Text style={{ color: 'white', fontSize: 60, fontFamily: 'barcode' }}>Start Scan</Text>
            </View>
          </TouchableOpacity>
        </View>
      }</View>
    }
  </View>
);
}
}
