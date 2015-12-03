<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model {

	protected $table = 'notifications';
	public $timestamps = true;
	protected $fillable = array('track_id', 'sender_id', 'seen', 'sender_name', 'track_name', 'track_cover', 'sender_cover');
    
    public function user(){
        $this->belongsTo('User');
    }


}