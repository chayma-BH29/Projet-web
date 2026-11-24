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
        Schema::create('transactions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('portefeuille_id')->constrained()->cascadeOnDelete();
        $table->foreignId('action_id')->constrained()->cascadeOnDelete();
        $table->enum('type', ['achat', 'vente']);
        $table->unsignedInteger('quantite');
        $table->decimal('prix_unitaire', 12, 2);
        $table->timestamp('date_transaction')->useCurrent();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
