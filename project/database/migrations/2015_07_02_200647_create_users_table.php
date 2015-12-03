<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUsersTable extends Migration {

	public function up()
	{
		Schema::create('users', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('username', 100)->unique();
			$table->string('permalink', 100)->unique();
			$table->string('uri', 255)->unique();
			$table->string('permalink_url', 255)->unique();
			$table->string('avatar_url', 255);
			$table->string('country', 100)->nullable();
			$table->string('full_name', 100)->nullable();
			$table->string('city', 100)->nullable();
			$table->string('description', 255)->nullable();
			$table->integer('track_count');
			$table->integer('playlist_count');
			$table->integer('followers_count');
			$table->integer('followings_count');
			$table->integer('public_favorites_count');
			$table->integer('revealed')->default('0');
			$table->integer('notif')->default('0');
			$table->datetime('last_co');
			$table->boolean('activated')->default(false);
			$table->integer('momentrack')->nullable();
			$table->integer('recommendation')->default('0');
			$table->string('email', 150)->unique();
		});
	}

	public function down()
	{
		Schema::drop('users');
	}
}