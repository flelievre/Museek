<?php

namespace App\Repositories;

use App\Refuse;

class RefuseRepository 
{

    protected $refuse;

    public function __construct(Refuse $refuse)
	{
		$this->refuse = $refuse;
	}

	private function save(Refuse $refuse, Array $inputs)
	{
        
		$refuse->track_id = intval($inputs['track_id']);
		$refuse->friend_id = intval($inputs['friend_id']);
		$refuse->user_id = intval($inputs['user_id']);	
		$refuse->track_name = $inputs['track_name'];	
		$refuse->track_cover = $inputs['track_cover'];	
		$refuse->track_url = $inputs['track_url'];	
		$refuse->save();
	}


	public function refuse(Array $inputs)
	{
		$refuse = new $this->refuse;
		$this->save($refuse, $inputs);
    }
    
    public function relike($id, $track_id)
    {
        Refuse::where('user_id', '=', $id)->where('track_id', '=', $track_id)->delete();
    }

	public function getById($id)
	{
		return $this->refuse->findOrFail($id);
	}
    
    public function getMyRefuse($id)
    {
        $myRefuses = Refuse::where('user_id', '=', $id)->get();
        return $myRefuses;
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