<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRefusesTable extends Migration {

	public function up()
	{
		Schema::create('refuses', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->integer('user_id')->unsigned();
			$table->integer('track_id');
			$table->integer('friend_id');
		});
	}

	public function down()
	{
		Schema::drop('refuses');
	}
}