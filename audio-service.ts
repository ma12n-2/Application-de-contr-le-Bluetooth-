import { TNSPlayer } from 'nativescript-audio';

export class AudioService {
  private player: TNSPlayer;

  constructor() {
    this.player = new TNSPlayer();
  }

  public async playAudio(audioFile: string, duration: number): Promise<void> {
    try {
      await this.player.playFromFile({
        audioFile,
        loop: false
      });

      return new Promise((resolve) => {
        setTimeout(() => {
          this.player.dispose();
          resolve();
        }, duration);
      });
    } catch (error) {
      console.error('خطأ في تشغيل الصوت:', error);
      throw error;
    }
  }

  public dispose(): void {
    this.player.dispose();
  }
}