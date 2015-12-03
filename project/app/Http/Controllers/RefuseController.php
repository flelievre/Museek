<?php

namespace App\Http\Controllers;

use App\Repositories\RefuseRepository;
use App\Repositories\UserRepository;
use Input;
use Validator;
use Illuminate\Http\Request;

class RefuseController extends Controller
{

    protected $refuseRepository;
    protected $userRepository;

    public function __construct(RefuseRepository $refuseRepository, UserRepository $userRepository)
    {
		$this->refuseRepository = $refuseRepository;
		$this->userRepository = $userRepository;
	}
    
    public function refuse(Request $request)
    {
        $credentials = $request->all();
        $user_id = $credentials['friend_id'];
        $validator = Validator::make($credentials, ['user_id' => 'required', 'friend_id' => 'required|numeric', 'track_id' => 'required|numeric', 'track_name' => 'required', 'track_cover' => 'required']);
        //change it as an arrey like first connexion !
        //$track_id = $this->notificationRepository->like($credentials);
        //return $id;
        if ($validator->fails()){
            return 'try again in a moment';
        }
        else {
           $this->refuseRepository->refuse($credentials);
           $this->userRepository->refuse(intval($credentials['user_id']));
        }
    }
    
    public function getMyRefuse(Request $request)
    {
        $credentials = $request->all();
        $validator = Validator::make($credentials, ['id' => 'required|numeric']);
        if ($validator->fails())
            return 'try again in a moment';
        else{
            $id = intval($credentials['id']);
            return json_encode($this->refuseRepository->getMyRefuse($id));
        }
    }
    
}