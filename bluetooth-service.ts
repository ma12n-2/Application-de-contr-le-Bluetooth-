import { Observable } from '@nativescript/core';
import { Bluetooth } from '@nativescript/bluetooth';

export class BluetoothService extends Observable {
  private bluetooth: Bluetooth;
  
  constructor() {
    super();
    this.bluetooth = new Bluetooth();
  }

  public async isBluetoothEnabled(): Promise<boolean> {
    const enabled = await this.bluetooth.isBluetoothEnabled();
    return enabled;
  }

  public async enableBluetooth(): Promise<void> {
    try {
      await this.bluetooth.enable();
    } catch (error) {
      console.error('خطأ في تفعيل البلوتوث:', error);
      throw error;
    }
  }

  public async scanForDevices(): Promise<any[]> {
    try {
      const devices = await this.bluetooth.startScanning({
        seconds: 4,
        onDiscovered: (peripheral) => {
          console.log('تم العثور على جهاز:', peripheral.name);
        }
      });
      return devices;
    } catch (error) {
      console.error('خطأ في البحث عن الأجهزة:', error);
      throw error;
    }
  }

  public async connect(deviceUUID: string): Promise<void> {
    try {
      await this.bluetooth.connect({
        UUID: deviceUUID,
        onConnected: (peripheral) => {
          console.log('تم الاتصال بنجاح:', peripheral.name);
        }
      });
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      throw error;
    }
  }

  public async disconnect(deviceUUID: string): Promise<void> {
    try {
      await this.bluetooth.disconnect({
        UUID: deviceUUID
      });
    } catch (error) {
      console.error('خطأ في قطع الاتصال:', error);
      throw error;
    }
  }
}