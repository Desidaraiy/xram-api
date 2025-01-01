import * as OneSignal from "onesignal-node";

class PushNotificationService {
  private static instance: PushNotificationService;
  private oneSignalClient: any;
  private appId: string;
  private apiKey: string;

  private constructor() {
    this.appId = process.env.ONESIGNAL_APP_ID || "";
    this.apiKey = process.env.ONESIGNAL_API_KEY || "";

    if (!this.appId || !this.apiKey) {
      throw new Error("OneSignal appId and apiKey must be provided.");
    }

    this.oneSignalClient = new OneSignal.Client(this.appId, this.apiKey);
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  public async sendPushNotification(
    pushId: string,
    message: string
  ): Promise<void> {
    const notification = {
      contents: { en: message },
      include_player_ids: [pushId],
    };
    try {
      const response =
        await this.oneSignalClient.createNotification(notification);
      console.log(response.body.id);
    } catch (e) {
      if (e instanceof OneSignal.HTTPError) {
        console.log(e.statusCode);
        console.log(e.body);
      }
    }
  }
}

export default PushNotificationService;
