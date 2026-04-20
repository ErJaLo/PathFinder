<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
	public function index(Request $request)
	{
		$messages = ContactMessage::query()
			->where('user_id', $request->user()->id)
			->select('id', 'type', 'subject', 'message', 'status', 'created_at')
			->latest()
			->paginate(10)
			->withQueryString();

		return Inertia::render('contact/contact-us', [
			'messages' => $messages,
		]);
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'type' => ['required', 'in:suggestion,technical_issue,account,other'],
			'subject' => ['required', 'string', 'max:120'],
			'message' => ['required', 'string', 'max:1000'],
		]);

		ContactMessage::create([
			'user_id' => $request->user()->id,
			'type' => $validated['type'],
			'subject' => $validated['subject'],
			'message' => $validated['message'],
			'status' => 'pending',
		]);

		return back()->with('success', 'Missatge enviat correctament.');
	}

	public function adminIndex(Request $request)
	{
		$perPage = $request->integer('perPage', 10);
		$page = $request->integer('page', 1);
		$offset = ($page - 1) * $perPage;
		$status = trim((string) $request->input('status', ''));
		$type = trim((string) $request->input('type', ''));
		$search = trim((string) $request->input('search', ''));

		$query = ContactMessage::query()
			->with('user:id,name,email')
			->select('id', 'user_id', 'type', 'subject', 'message', 'status', 'created_at', 'updated_at')
			->when(
				$search !== '',
				fn($q) => $q->where(function ($searchQuery) use ($search) {
					$searchQuery->where('subject', 'like', "%{$search}%")
						->orWhere('message', 'like', "%{$search}%")
						->orWhereHas('user', function ($userQuery) use ($search) {
							$userQuery->where('name', 'like', "%{$search}%")
								->orWhere('email', 'like', "%{$search}%");
						});
				})
			)
			->when($status !== '', fn($q) => $q->where('status', $status))
			->when($type !== '', fn($q) => $q->where('type', $type));

		$total = $query->count();

		$messages = $query->orderByDesc('created_at')
			->limit($perPage)
			->offset($offset)
			->get();

		return Inertia::render('admin/contact-messages', [
			'messages' => $messages,
			'perPage' => $perPage,
			'page' => $page,
			'total' => $total,
			'status' => $status,
			'type' => $type,
			'search' => $search,
		]);
	}

	public function adminShow(ContactMessage $contactMessage)
	{
		$contactMessage->load('user:id,name,email');

		return Inertia::render('admin/contact-message-detail', [
			'message' => $contactMessage,
		]);
	}

	public function markInReview(ContactMessage $contactMessage)
	{
		if ($contactMessage->status !== 'resolved') {
			$contactMessage->update(['status' => 'in_review']);
		}

		return back();
	}

	public function markResolved(ContactMessage $contactMessage)
	{
		$contactMessage->update(['status' => 'resolved']);

		return back();
	}
}
