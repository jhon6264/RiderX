<?php

namespace App\Actions\Fortify;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

class SendEmailVerificationNotification
{
    public function handle($user)
    {
        Notification::send($user, new VerifyEmail);
    }
}