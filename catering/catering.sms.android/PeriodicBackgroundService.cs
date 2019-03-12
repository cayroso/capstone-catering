﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Views;
using Android.Widget;

namespace catering.sms.android
{
    [Service]
    class PeriodicBackgroundService : Service
    {
        private const string Tag = "[PeriodicBackgroundService]";

        private bool _isRunning;
        private Context _context;
        private Task _task;

        #region overrides

        public override IBinder OnBind(Intent intent)
        {
            return null;
        }

        public override void OnCreate()
        {
            _context = this;
            _isRunning = false;
            _task = new Task(DoWork);
        }

        public override void OnDestroy()
        {
            _isRunning = false;

            if (_task != null && _task.Status == TaskStatus.RanToCompletion)
            {
                _task.Dispose();
            }
        }

        public override StartCommandResult OnStartCommand(Intent intent, StartCommandFlags flags, int startId)
        {
            if (!_isRunning)
            {
                _isRunning = true;
                _task.Start();
            }
            return StartCommandResult.Sticky;
        }

        #endregion

        private void DoWork()
        {
            try
            {
                Log.WriteLine(LogPriority.Info, Tag, "Started!");

                // Do something...

            }
            catch (Exception e)
            {
                Log.WriteLine(LogPriority.Error, Tag, e.ToString());
            }
            finally
            {
                StopSelf();
            }
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