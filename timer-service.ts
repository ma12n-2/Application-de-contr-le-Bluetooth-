import { Observable } from '@nativescript/core';

export class TimerService extends Observable {
  private _countdown: number = 0;
  private _countdownText: string = '';
  private countdownInterval: any;

  get countdownText(): string {
    return this._countdownText;
  }

  public startCountdown(seconds: number): Promise<void> {
    return new Promise((resolve) => {
      this._countdown = seconds;
      this.updateCountdownText();

      this.countdownInterval = setInterval(() => {
        this._countdown--;
        this.updateCountdownText();

        if (this._countdown <= 0) {
          this.stopCountdown();
          resolve();
        }
      }, 1000);
    });
  }

  public stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private updateCountdownText(): void {
    const minutes = Math.floor(this._countdown / 60);
    const seconds = this._countdown % 60;
    this._countdownText = `الوقت المتبقي: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    this.notifyPropertyChange('countdownText', this._countdownText);
  }
}