<?php

namespace App\Repositories;

use App\Notification;

class NotificationRepository 
{

    protected $notification;

    public function __construct(Notification $notification)
	{
		$this->notification = $notification;
	}

	private function save(Notification $notification, Array $inputs)
	{
        
		$notification->track_id = intval($inputs['track_id']);
		$notification->sender_id = intval($inputs['sender_id']);
		$notification->user_id = intval($inputs['friend_id']);	
		$notification->sender_name = ($inputs['sender_name']);	
		$notification->track_cover = ($inputs['track_cover']);	
		$notification->sender_cover = ($inputs['sender_cover']);	
		$notification->track_name = ($inputs['track_name']);	
        $notification->seen = 0;
		$notification->save();
	}


	public function like(Array $inputs)
	{
		$notification = new $this->notification;
		$this->save($notification, $inputs);
	}
    
    public function getMyNotifications($id)
    {
        $myNotifications = Notification::where('user_id', '=', $id)->where('seen', '=' , 0)->orderBy('id', 'DESC')->get();
        return $myNotifications;
    }
    
    public function getAllNotifications($id)
    {
        $myNotifications = Notification::where('user_id', '=', $id)->orderBy('id', 'DESC')->get();
        return $myNotifications;
    }

	public function getById($id)
	{
		return $this->notification->findOrFail($id);
	}
    
    public function deleteNotif($idNotif)
    {
        $notif = Notification::find($idNotif);
        $notif->seen = 1;
        $notif->save();
    }
    
/*
	public function update($id, Array $inputs)
	{
		$this->save($this->getById($id), $inputs);
	}

	public function destroy($id)
	{
		$this->getById($id)->delete();
	}
*/
    
}