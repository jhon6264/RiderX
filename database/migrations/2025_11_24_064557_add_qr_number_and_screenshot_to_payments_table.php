<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->integer('qr_number')->nullable()->after('gcash_number');
            $table->string('screenshot_path')->nullable()->after('notes');
        });
    }

    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['qr_number', 'screenshot_path']);
        });
    }
};