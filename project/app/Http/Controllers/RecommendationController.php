<?php 

namespace App\Http\Controllers;

use App\Repositories\RecommendationRepository;
use App\Repositories\UserRepository;
use Input;
use Validator;
use Illuminate\Http\Request;

class RecommendationController extends Controller {
    
    protected $recommendationRepository;
    protected $userRepository;

    public function __construct(RecommendationRepository $recommendationRepository, UserRepository $userRepository)
    {
		$this->recommendationRepository = $recommendationRepository;
		$this->userRepository = $userRepository;
	}
    

  /**
   * Display a listing of the resource.
   *
   * @return Response
   */
  public function sendReco(Request $request){
     return 'sendReco'; 
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