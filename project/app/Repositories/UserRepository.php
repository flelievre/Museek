<?php

namespace App\Repositories;

use App\User;
use Carbon\Carbon;

class UserRepository
{

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    private function save(User $user, Array $inputs)
    {
        $user->id = $inputs['id'];
        $user->permalink = $inputs['permalink'];    
        $user->username = $inputs['username'];    
        $user->uri = $inputs['uri'];    
        $user->permalink_url = $inputs['permalink_url'];    
        $user->avatar_url = $inputs['avatar_url'];    
        $user->country = $inputs['country'];    
        $user->full_name = $inputs['full_name'];    
        $user->city = $inputs['city'];    
        $user->description = $inputs['description'];    
        $user->track_count = $inputs['track_count'];    
        $user->playlist_count = $inputs['playlist_count'];    
        $user->followers_count = $inputs['followers_count'];    
        $user->followings_count = $inputs['followings_count'];    
        $user->public_favorites_count = $inputs['public_favorites_count'];    
        $user->save();
    }
    
    public function add(Array $inputs){
        $user = new $this->user;  
        $user->revealed = 0;   //calculate revealed !!! 
        $user->notif = 0;    //calculate notif !!!
        $user->activated = 0;    
        $user->recommendation = 0;//calculate
        $this->save($user, $inputs);
        
    }

    public function store(Array $inputs)
    {
        $user = new $this->user;   
        $user->revealed = 0;   //calculate revealed !!! 
        $user->notif = 0;    //calculate notif !!!
        $user->last_co = Carbon::now();   
        $user->activated = 0;    
        $user->recommendation = 0;//calculate
        $this->save($user, $inputs);

        return $user;
    }

    public function getById($id)
    {
        return $this->user->findOrFail($id);
    }
    
    public function existId($id)
    {
        $user = $this->user->find($id);
        if(is_null($user)){
            return false;
        }
        else
            return true;
    }
    
    

    public function update($id, Array $inputs)
    {
        $user = $this->getById($id);
        $this->save($user, $inputs);
        return $user;
        
    }

    public function destroy($id)
    {
        $this->getById($id)->delete();
    }
    
    public function like($idUser)
    {
        $user = $this->getById($idUser);
        $user->notif++;
        $user->revealed++;
        $user->save();
    }
    
    public function refuse($idUser)
    {
        $user = $this->getById($idUser);
        $user->refuse++;
        $user->save();
    }
    
    public function relike($idUser)
    {
        $user = $this->getById($idUser);
        $user->refuse--;
        $user->save();
    }
    
    public function deleteNotif($idUser)
    {
        $user = $this->getById($idUser);
        $user->notif--;
        $user->save();
    }
    
    public function setMomenTrack($idUser, $idTrack)
    {
        $user = $this->getById($idUser);
        $user->momentrack = $idTrack;
        $user->save();
    }
    
    public function getMomenTracks($followingsId, $myId)
    {
        $res = array();
        $user = $this->getById($myId);
        array_push($res, $user);
        foreach($followingsId as $id){
            if ($this->existId($id)){
                $user = $this->getById($id);
                array_push($res, $user);
            }
        }
        return $res;
    }
}