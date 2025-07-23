export const uvid = () => {
    const prefix = 'UVID';
    const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
    const timestamp = Date.now().toString().slice(-5); // last 5 digits of timestamp
    return `${prefix}-${randomPart}-${timestamp}`;
  };
  