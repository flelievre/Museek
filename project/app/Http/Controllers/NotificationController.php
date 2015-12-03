<?php

namespace App\Http\Controllers;

use App\Repositories\NotificationRepository;
use App\Repositories\UserRepository;
use App\Repositories\RefuseRepository;
use Input;
use Validator;
use Illuminate\Http\Request;

class NotificationController extends Controller
{

    protected $notificationRepository;
    protected $refuseRepository;
    protected $userRepository;

    public function __construct(RefuseRepository $refuseRepository, NotificationRepository $notificationRepository, UserRepository $userRepository)
    {
		$this->notificationRepository = $notificationRepository;
		$this->userRepository = $userRepository;
		$this->refuseRepository = $refuseRepository;
	}
    
    public function like(Request $request)
    {
        $credentials = $request->all();
        $user_id = $credentials['friend_id'];
        $user = $credentials['user'];
        $user = (array)$user;
        $validator = Validator::make($credentials, ['user' => 'required', 'sender_id' => 'required|numeric', 'track_id' => 'required|numeric', 'sender_name' => 'required', 'track_cover' => 'required', 'track_name' => 'required', 'sender_cover' => 'required']);
        //change it as an arrey like first connexion !
        //$track_id = $this->notificationRepository->like($credentials);
        //return $id;
        if ($validator->fails()){
            return 'try again in a moment';
        }
        else {
            if (!$this->userRepository->existId($user_id))
            {
                $this->userRepository->add($user);
            }
            $this->userRepository->like($user_id);
            $credentials = (array)$credentials;
            $this->notificationRepository->like($credentials);
        }
    }
    
    public function relike(Request $request)
    {
        $credentials = $request->all();
        $user_id = $credentials['friend_id'];
        $myId = $credentials['sender_id'];
        $track_id = $credentials['track_id'];
        $user = $credentials['user'];
        $user = (array)$user;
        $validator = Validator::make($credentials, ['user' => 'required', 'sender_id' => 'required|numeric', 'track_id' => 'required|numeric', 'sender_name' => 'required', 'track_cover' => 'required', 'track_name' => 'required', 'sender_cover' => 'required']);
        //change it as an arrey like first connexion !
        //$track_id = $this->notificationRepository->like($credentials);
        //return $id;
        if ($validator->fails()){
            return 'try again in a moment';
        }
        else {
            if (!$this->userRepository->existId($user_id))
            {
                $this->userRepository->add($user);
            }
            $this->userRepository->relike($myId);
            if ($user_id != $myId){
                $this->userRepository->like($user_id);
                $credentials = (array)$credentials;
                $this->notificationRepository->like($credentials);
            }
            $this->refuseRepository->relike($myId, $track_id);
        }
    }
    
    public function getMyNotifications(Request $request)
    {
        $credentials = $request->all();
        $user_id = $credentials['id'];
        $validator = Validator::make($credentials, ['id' => 'required|numeric']);
        if ($validator->fails()){
            return 'try again in a moment';
        }
        else {
            if ($this->userRepository->existId($user_id))
            {
                return json_encode($this->notificationRepository->getMyNotifications($user_id));
            }
        }
    }
    
    public function hideNotif(Request $request)
    {
        $credentials = $request->all();
        $idNotif = intval($credentials['idNotif']);
        $idUser = intval($credentials['idUser']);
        $validator = Validator::make($credentials, ['idNotif' => 'required|numeric', 'idUser' => 'required|numeric']);
        if ($validator->fails()){
            return 'try again in a moment';
        }
        else {
            $this->notificationRepository->deleteNotif($idNotif);
            $this->userRepository->deleteNotif($idUser);
        }
    }
}