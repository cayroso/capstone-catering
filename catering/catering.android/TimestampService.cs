using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Telephony;
using Android.Util;
using Android.Views;
using Android.Widget;
using ModernHttpClient;
using Newtonsoft.Json;

namespace catering.android
{
    /// <summary>
	/// This is a sample started service. When the service is started, it will log a string that details how long 
	/// the service has been running (using Android.Util.Log). This service displays a notification in the notification
	/// tray while the service is active.
	/// </summary>
	[Service]
    public class TimestampService : Service
    {
        private SmsManager _smsManager = SmsManager.Default;
        private BroadcastReceiver _smsSentBroadcastReceiver, _smsDeliveredBroadcastReceiver;

        static readonly string TAG = typeof(TimestampService).FullName;

        UtcTimestamper timestamper;
        bool isStarted;
        Handler handler;
        Action runnable;

        public override void OnCreate()
        {
            base.OnCreate();
            Log.Info(TAG, "OnCreate: the service is initializing.");

            timestamper = new UtcTimestamper();
            handler = new Handler();
            
            runnable = new Action(async () =>
            {
                if (timestamper == null)
                {
                    Log.Wtf(TAG, "Why isn't there a Timestamper initialized?");
                }
                else
                {
                    //  TODO get all the pending sms, then send the sms, then update
                    var items = new List<ShortMessage>();

                    //var url = "http://104.215.158.168/catering/";
                    var url = "http://batangas.southeastasia.cloudapp.azure.com/catering/";
                    using (var client = new HttpClient())
                    {
                        // send a GET request  
                        var uri = $"{url}api/message/forSend";
                        var result = await client.GetStringAsync(uri);

                        items.AddRange(JsonConvert.DeserializeObject<List<ShortMessage>>(result));
                    }

                    using (var post = new HttpClient(new NativeMessageHandler()))
                    {
                        foreach (var item in items.Where(p => p.DateSent == null))
                         {
                            try
                            {
                                //  SEND SMS
                                var piSent = PendingIntent.GetBroadcast(this, 0, new Intent("SMS_SENT"), 0);
                                var piDelivered = PendingIntent.GetBroadcast(this, 0, new Intent("SMS_DELIVERED"), 0);

                                _smsManager.SendTextMessage(item.Receiver, null, item.Body, piSent, piDelivered);
                                
                                var uri = $"{url}api/message/sent2/?id={item.ShortMessageId}";
                                var resp = await post.GetAsync(new Uri(uri));

                                //resp.EnsureSuccessStatusCode();
                                Log.Debug(TAG, item.Body);
                            }
                            catch(Exception ex)
                            {
                                Log.Error(TAG, ex.ToString());

                            }
                        }
                    }

                    string msg = timestamper.GetFormattedTimestamp();
                    Log.Debug(TAG, msg);
                    Intent i = new Intent(Constants.NOTIFICATION_BROADCAST_ACTION);
                    i.PutExtra(Constants.BROADCAST_MESSAGE_KEY, msg);
                    Android.Support.V4.Content.LocalBroadcastManager.GetInstance(this).SendBroadcast(i);
                    handler.PostDelayed(runnable, Constants.DELAY_BETWEEN_LOG_MESSAGES);
                }
            });
        }

        public override StartCommandResult OnStartCommand(Intent intent, StartCommandFlags flags, int startId)
        {
            if (intent.Action.Equals(Constants.ACTION_START_SERVICE))
            {
                if (isStarted)
                {
                    Log.Info(TAG, "OnStartCommand: The service is already running.");
                }
                else
                {
                    Log.Info(TAG, "OnStartCommand: The service is starting.");
                    RegisterForegroundService();
                    handler.PostDelayed(runnable, Constants.DELAY_BETWEEN_LOG_MESSAGES);
                    isStarted = true;

                    _smsSentBroadcastReceiver = new SMSSentReceiver();
                    _smsDeliveredBroadcastReceiver = new SMSDeliveredReceiver();

                    RegisterReceiver(_smsSentBroadcastReceiver, new IntentFilter("SMS_SENT"));
                    RegisterReceiver(_smsDeliveredBroadcastReceiver, new IntentFilter("SMS_DELIVERED"));
                }
            }
            else if (intent.Action.Equals(Constants.ACTION_STOP_SERVICE))
            {
                Log.Info(TAG, "OnStartCommand: The service is stopping.");
                timestamper = null;
                StopForeground(true);
                StopSelf();
                isStarted = false;

                UnregisterReceiver(_smsSentBroadcastReceiver);
                UnregisterReceiver(_smsDeliveredBroadcastReceiver);

            }
            else if (intent.Action.Equals(Constants.ACTION_RESTART_TIMER))
            {
                Log.Info(TAG, "OnStartCommand: Restarting the timer.");
                timestamper.Restart();

            }

            // This tells Android not to restart the service if it is killed to reclaim resources.
            return StartCommandResult.Sticky;
        }


        public override IBinder OnBind(Intent intent)
        {
            // Return null because this is a pure started service. A hybrid service would return a binder that would
            // allow access to the GetFormattedStamp() method.
            return null;
        }


        public override void OnDestroy()
        {
            // We need to shut things down.
            Log.Debug(TAG, GetFormattedTimestamp() ?? "The TimeStamper has been disposed.");
            Log.Info(TAG, "OnDestroy: The started service is shutting down.");

            // Stop the handler.
            handler.RemoveCallbacks(runnable);

            // Remove the notification from the status bar.
            var notificationManager = (NotificationManager)GetSystemService(NotificationService);
            notificationManager.Cancel(Constants.SERVICE_RUNNING_NOTIFICATION_ID);

            timestamper = null;
            isStarted = false;
            base.OnDestroy();
        }

        /// <summary>
        /// This method will return a formatted timestamp to the client.
        /// </summary>
        /// <returns>A string that details what time the service started and how long it has been running.</returns>
        string GetFormattedTimestamp()
        {

            return timestamper?.GetFormattedTimestamp();
        }

        void RegisterForegroundService()
        {
            var notification = new Notification.Builder(this)
                .SetContentTitle(Resources.GetString(Resource.String.app_name))
                .SetContentText(Resources.GetString(Resource.String.notification_text))
                .SetSmallIcon(Resource.Mipmap.ic_launcher)//.Drawable.ic_stat_name)
                .SetContentIntent(BuildIntentToShowMainActivity())
                .SetOngoing(true)
                .AddAction(BuildRestartTimerAction())
                .AddAction(BuildStopServiceAction())
                .Build();


            // Enlist this instance of the service as a foreground service
            StartForeground(Constants.SERVICE_RUNNING_NOTIFICATION_ID, notification);
        }

        /// <summary>
        /// Builds a PendingIntent that will display the main activity of the app. This is used when the 
        /// user taps on the notification; it will take them to the main activity of the app.
        /// </summary>
        /// <returns>The content intent.</returns>
        PendingIntent BuildIntentToShowMainActivity()
        {
            var notificationIntent = new Intent(this, typeof(MainActivity));
            notificationIntent.SetAction(Constants.ACTION_MAIN_ACTIVITY);
            notificationIntent.SetFlags(ActivityFlags.SingleTop | ActivityFlags.ClearTask);
            notificationIntent.PutExtra(Constants.SERVICE_STARTED_KEY, true);

            var pendingIntent = PendingIntent.GetActivity(this, 0, notificationIntent, PendingIntentFlags.UpdateCurrent);
            return pendingIntent;
        }

        /// <summary>
        /// Builds a Notification.Action that will instruct the service to restart the timer.
        /// </summary>
        /// <returns>The restart timer action.</returns>
        Notification.Action BuildRestartTimerAction()
        {
            var restartTimerIntent = new Intent(this, GetType());
            restartTimerIntent.SetAction(Constants.ACTION_RESTART_TIMER);
            var restartTimerPendingIntent = PendingIntent.GetService(this, 0, restartTimerIntent, 0);

            var builder = new Notification.Action.Builder(Resource.Mipmap.ic_launcher,
                                              GetText(Resource.String.restart_timestamp_service_button_text),
                                              restartTimerPendingIntent);

            return builder.Build();
        }

        /// <summary>
        /// Builds the Notification.Action that will allow the user to stop the service via the
        /// notification in the status bar
        /// </summary>
        /// <returns>The stop service action.</returns>
        Notification.Action BuildStopServiceAction()
        {
            var stopServiceIntent = new Intent(this, GetType());
            stopServiceIntent.SetAction(Constants.ACTION_STOP_SERVICE);
            var stopServicePendingIntent = PendingIntent.GetService(this, 0, stopServiceIntent, 0);

            var builder = new Notification.Action.Builder(Android.Resource.Drawable.IcMediaPause,
                                                          GetText(Resource.String.stop_service),
                                                          stopServicePendingIntent);
            return builder.Build();

        }
    }

    [BroadcastReceiver]
    public class SMSSentReceiver : BroadcastReceiver
    {
        public override void OnReceive(Context context, Intent intent)
        {
            switch ((int)ResultCode)
            {
                case (int)Result.Ok:
                    Toast.MakeText(Application.Context, "SMS has been sent", ToastLength.Short).Show();
                    break;
                case (int)SmsResultError.GenericFailure:
                    Toast.MakeText(Application.Context, "Generic Failure", ToastLength.Short).Show();
                    break;
                case (int)SmsResultError.NoService:
                    Toast.MakeText(Application.Context, "No Service", ToastLength.Short).Show();
                    break;
                case (int)SmsResultError.NullPdu:
                    Toast.MakeText(Application.Context, "Null PDU", ToastLength.Short).Show();
                    break;
                case (int)SmsResultError.RadioOff:
                    Toast.MakeText(Application.Context, "Radio Off", ToastLength.Short).Show();
                    break;
            }
        }
    }

    [BroadcastReceiver]
    public class SMSDeliveredReceiver : BroadcastReceiver
    {
        public override void OnReceive(Context context, Intent intent)
        {
            switch ((int)ResultCode)
            {
                case (int)Result.Ok:
                    Toast.MakeText(Application.Context, "SMS Delivered", ToastLength.Short).Show();
                    break;
                case (int)Result.Canceled:
                    Toast.MakeText(Application.Context, "SMS not delivered", ToastLength.Short).Show();
                    break;
            }
        }
    }

    public class UtcTimestamper
    {
        DateTime startTime;
        bool wasReset = false;

        public UtcTimestamper()
        {
            startTime = DateTime.UtcNow;
        }

        public string GetFormattedTimestamp()
        {
            TimeSpan duration = DateTime.UtcNow.Subtract(startTime);

            return wasReset ? $"Service restarted at {startTime} ({duration:c} ago)." : $"Service started at {startTime} ({duration:c} ago).";
        }

        public void Restart()
        {
            startTime = DateTime.UtcNow;
            wasReset = true;
        }
    }

    public class ShortMessage
    {
        public ShortMessage()
        {
            Sender = string.Empty;
            Receiver = string.Empty;
            Subject = string.Empty;
            Body = string.Empty;
            DateCreated = DateTime.UtcNow;
            SentCount = 0;
            Result = string.Empty;
        }

        public string ShortMessageId { get; set; }
        public string ReservationId { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateSent { get; set; }
        public int SentCount { get; set; }
        public string Result { get; set; }
    }
}