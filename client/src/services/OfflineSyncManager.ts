import { api } from './api';

const QUEUE_STORAGE_KEY = 'antarctic_twin_offline_queue';

export class OfflineSyncManager {
  private static isSyncing = false;

  public static getQueue(): any[] {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public static enqueuePacket(packet: { station: string; sensorId: string; timestamp?: string; data: Record<string, any> }): number {
    const queue = this.getQueue();
    queue.push(packet);
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn('LocalStorage queue limit reached');
    }
    return queue.length;
  }

  public static clearQueue() {
    localStorage.removeItem(QUEUE_STORAGE_KEY);
  }

  public static async flushQueue(onProgress?: (status: string, count: number) => void): Promise<number> {
    if (this.isSyncing) return 0;
    const queue = this.getQueue();
    if (queue.length === 0) return 0;

    this.isSyncing = true;
    if (onProgress) onProgress(`SYNCING... ${queue.length} packet(s) uploading`, queue.length);

    try {
      const res = await api.syncTelemetryQueue(queue);
      if (res.success) {
        const flushedCount = queue.length;
        this.clearQueue();
        if (onProgress) onProgress(`SYNC COMPLETE! ${flushedCount} packet(s) synchronized.`, 0);
        this.isSyncing = false;
        return flushedCount;
      }
    } catch (err: any) {
      if (onProgress) onProgress(`SYNC ERROR: ${err.message}. Retrying when online.`, queue.length);
    }

    this.isSyncing = false;
    return 0;
  }
}
