<?php namespace App\Http\Controllers;

use Session;
use Njasm\Soundcloud\Auth\Auth;
use App\Repositories\UserRepository;
use App\Repositories\RefuseRepository;
use Validator;
use Illuminate\Http\Request;


class UserController extends Controller {
    
    protected $userRepository;
    protected $refuseRepository;

    protected $nbrPerPage = 4;

    public function __construct(UserRepository $userRepository, RefuseRepository $refuseRepository)
    {
		$this->userRepository = $userRepository;
		$this->refuseRepository = $refuseRepository;
	}
    
    public function connexion()
    {
        
        $facade = app('Soundcloud');
        // this is your callbackUri script that will receive the $_GET['code']
        $code = $_GET['code'];
        
        if (!(Session::get('token')))
        {
            $response = $facade->codeForToken($code);
            Session::put('token', $facade->getToken());
        }
        else 
        {
            $facade->setAccessToken(Session::get('token'));
            
        }
        $token = Session::get('token');
       // $client_id = $facade->getAuthClientID();
        //$redirect_uri = $facade->getAuthUrlCallback();
        //$client_secret = $facade->getClientSecret();
        //echo $client_id;
        //Cookie::queue(Cookie::forever('myjukebox', $token));
        //$params = array('client_id' => $client_id , 'redirect_uri' => $redirect_uri , 'client_secret' => $client_secret;
        //var_dump($params);
        $response = $facade->get('/me')->request();
        //echo $response->bodyRaw();
        // as object
        $me = $response->bodyObject();
        $me = (array)$me;
        
        $id = intval($me['id']);
        if ($this->userRepository->existId($id)){
            $user = $this->userRepository->update($id, $me);
        }
        else{
            $user = $this->userRepository->store($me);
        }
        Session::put('id', $user->id);
        $refuse = $this->refuseRepository->getMyRefuse($me['id']);
        return view('play')->with('user', $user)->with('token', $token)->with('refuse', $refuse);
    }
    
    public function setMomenTrack(Request $request)
    {
        $credentials = $request->all();
        $validator = Validator::make($credentials, ['user_id' => 'required|numeric', 'track_id' => 'required|numeric']);
        if ($validator->fails()){
            return 'try again in a moment';
        }
        else
           $this->userRepository->setMomenTrack(intval($credentials['user_id']), intval($credentials['track_id']));
    }
    
    public function getMomenTracks(Request $request)
    {
        $credentials = $request->all();
        $validator = Validator::make($credentials, ['followingsId' => 'required', 'myId' => 'required']);
        if ($validator->fails())
            return 'try again in a moment';
        else
            return json_encode($this->userRepository->getMomenTracks($credentials['followingsId'], $credentials['myId']));
    }

  /**
   * Display a listing of the resource.
   *
   * @return Response
   */
  public function index()
  {
    
  }

  /**
   * Show the form for creating a new resource.
   *
   * @return Response
   */
  public function create()
  {
    
  }

  /**
   * Store a newly created resource in storage.
   *
   * @return Response
   */
  public function store()
  {
    
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return Response
   */
  public function show($id)
  {
    
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param  int  $id
   * @return Response
   */
  public function edit($id)
  {
    
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  int  $id
   * @return Response
   */
  public function update($id)
  {
    
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return Response
   */
  public function destroy($id)
  {
    
  }
  
}

?>