<?php namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract {

	use Authenticatable, CanResetPassword;
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $table = 'users';
	public $timestamps = true;
	protected $fillable = array('id', 'username', 'permalink', 'uri', 'permalink_url', 'avatar_url', 'country', 'full_name', 'city', 'track_count', 'playlist_count', 'followers_count', 'followings_count', 'public_favorites_count', 'revealed', 'notif', 'last_co', 'activated', 'momentrack', 'recommendation');
    
    public function notifications(){
        $this->hasMany('Notification');
    }
    
    public function refuses(){
        $this->hasMany('Refuse');
    }
    
    public function recommendations(){
        $this->hasMany('Notification');
    }

}
