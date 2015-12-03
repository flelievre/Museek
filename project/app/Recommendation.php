<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model {

	protected $table = 'recommendations';
	public $timestamps = true;
	protected $fillable = array('sender_id', 'track_id', 'seen');
    
    public function user(){
        $this->belongsTo('User');
    }

}