<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('historique_prix', function (Blueprint $table) {
        $table->id();
        $table->foreignId('action_id')->constrained()->cascadeOnDelete();
        $table->decimal('prix', 12, 2);
        $table->timestamp('date_prix')->useCurrent();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_prix');
    }
};
