import { MirrorCloneResource } from '../types';

// Use XHR to avoid Cross-Origin Read Blocking (CORB) that occurs using Fetch
// https://www.chromestatus.com/feature/5629709824032768
export default function requestMirrorCloneResource(
  mirrorUrl: string
): Promise<MirrorCloneResource | null> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', mirrorUrl);
    xhr.send();
    xhr.ontimeout = () => {
      reject(new Error('timeout'));
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);

            if (json) {
              resolve(json);
            }

            resolve(null);
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }
    };
  });
}
