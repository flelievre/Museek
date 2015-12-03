<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRecommendationsTable extends Migration {

	public function up()
	{
		Schema::create('recommendations', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->integer('user_id')->unsigned();
			$table->integer('sender_id');
			$table->integer('track_id');
			$table->boolean('seen')->default(false);
		});
	}

	public function down()
	{
		Schema::drop('recommendations');
	}
}