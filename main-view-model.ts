import { Observable } from '@nativescript/core';
import { BluetoothService } from '../bluetooth/bluetooth-service';
import { AudioService } from '../services/audio-service';
import { TimerService } from '../services/timer-service';

export class MainViewModel extends Observable {
  private bluetoothService: BluetoothService;
  private audioService: AudioService;
  private timerService: TimerService;
  private _isScanning: boolean = false;
  private _devices: any[] = [];
  private _errorMessage: string = '';

  constructor() {
    super();
    this.bluetoothService = new BluetoothService();
    this.audioService = new AudioService();
    this.timerService = new TimerService();

    // ربط حدث تغيير النص في العد التنازلي
    this.timerService.on('propertyChange', (data: any) => {
      if (data.propertyName === 'countdownText') {
        this.notifyPropertyChange('countdownText', this.countdownText);
      }
    });
  }

  get devices(): any[] {
    return this._devices;
  }

  get isScanning(): boolean {
    return this._isScanning;
  }

  get countdownText(): string {
    return this.timerService.countdownText;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  public async startScanning() {
    try {
      this._isScanning = true;
      this._errorMessage = '';
      this.notifyPropertyChange('isScanning', true);
      this.notifyPropertyChange('errorMessage', '');

      const enabled = await this.bluetoothService.isBluetoothEnabled();
      if (!enabled) {
        await this.bluetoothService.enableBluetooth();
      }

      this._devices = await this.bluetoothService.scanForDevices();
      this.notifyPropertyChange('devices', this._devices);
    } catch (error) {
      this._errorMessage = 'حدث خطأ أثناء البحث عن الأجهزة';
      this.notifyPropertyChange('errorMessage', this._errorMessage);
      console.error('خطأ:', error);
    } finally {
      this._isScanning = false;
      this.notifyPropertyChange('isScanning', false);
    }
  }

  public async connectToDevice(deviceUUID: string) {
    try {
      this._errorMessage = '';
      this.notifyPropertyChange('errorMessage', '');
      
      await this.bluetoothService.connect(deviceUUID);
      await this.timerService.startCountdown(5 * 60); // 5 دقائق
      await this.audioService.playAudio('~/assets/alarm.mp3', 25000);
      await this.disconnectDevice(deviceUUID);
    } catch (error) {
      this._errorMessage = 'حدث خطأ أثناء الاتصال بالجهاز';
      this.notifyPropertyChange('errorMessage', this._errorMessage);
      console.error('خطأ في الاتصال:', error);
    }
  }

  private async disconnectDevice(deviceUUID: string) {
    try {
      await this.bluetoothService.disconnect(deviceUUID);
    } catch (error) {
      this._errorMessage = 'حدث خطأ أثناء قطع الاتصال';
      this.notifyPropertyChange('errorMessage', this._errorMessage);
      console.error('خطأ في قطع الاتصال:', error);
    }
  }

  public dispose() {
    this.timerService.stopCountdown();
    this.audioService.dispose();
  }
}