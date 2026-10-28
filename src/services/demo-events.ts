export const DEMO_CHANGED = "association-demo-content-changed";
export const DEMO_STORAGE_STATUS = "association-demo-storage-status";
let issue = false;
export const hasStorageIssue = () => issue;
export function reportStorageIssue(value: boolean) {
  if (issue === value) return;
  issue = value;
  window.dispatchEvent(new Event(DEMO_STORAGE_STATUS));
}
export function notifyDemoChange() {
  window.dispatchEvent(new Event(DEMO_CHANGED));
  if ("BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel(DEMO_CHANGED);
      channel.postMessage("changed");
      channel.close();
    } catch {
      /* Focus refresh remains available. */
    }
  }
}
