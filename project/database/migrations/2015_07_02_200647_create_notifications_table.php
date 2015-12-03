<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateNotificationsTable extends Migration {

	public function up()
	{
		Schema::create('notifications', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->integer('user_id')->unsigned();
			$table->integer('track_id');
			$table->integer('sender_id');
			$table->boolean('seen')->default(false);
		});
	}

	public function down()
	{
		Schema::drop('notifications');
	}
}