export class apiResponse {
  constructor(statusCode, data, message = "success", meta = null) {
    this.statusCode = statusCode;
    this.data = data;
    this.success = statusCode < 400;
    this.message = message;
    if (meta) {
      this.meta = meta;
    }
    this.timeStamp = new Date().toISOString();
  }
}
