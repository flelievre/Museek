<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Refuse extends Model {

	protected $table = 'refuses';
	public $timestamps = true;
	protected $fillable = array('user_id', 'track_id', 'friend_id');
    
    public function user(){
        $this->belongsTo('User');
    }

}