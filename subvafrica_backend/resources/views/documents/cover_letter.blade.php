<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lettre de Motivation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            text-align: right;
            margin-bottom: 40px;
        }
        
        .sender-info {
            margin-bottom: 20px;
        }
        
        .sender-info h3 {
            margin: 0;
            font-size: 18px;
            color: #2c3e50;
        }
        
        .sender-info p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        .date {
            margin-bottom: 40px;
            text-align: right;
            font-size: 14px;
        }
        
        .recipient {
            margin-bottom: 30px;
        }
        
        .recipient h4 {
            margin: 0;
            font-size: 16px;
            color: #2c3e50;
        }
        
        .subject {
            margin-bottom: 30px;
            font-weight: bold;
            text-decoration: underline;
        }
        
        .content {
            text-align: justify;
            margin-bottom: 30px;
        }
        
        .content p {
            margin-bottom: 15px;
        }
        
        .signature {
            margin-top: 40px;
            text-align: right;
        }
        
        .signature p {
            margin: 5px 0;
        }
        
        @media print {
            body {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="sender-info">
            <h3>{{ $data['user_profile']->first_name ?? '' }} {{ $data['user_profile']->last_name ?? '' }}</h3>
            <p>{{ $data['user_profile']->email ?? '' }}</p>
            <p>{{ $data['user_profile']->phone ?? '' }}</p>
            <p>{{ $data['user_profile']->address ?? '' }}</p>
        </div>
    </div>
    
    <div class="date">
        {{ \Carbon\Carbon::now()->locale('fr')->isoFormat('LL') }}
    </div>
    
    <div class="recipient">
        <h4>{{ $data['company_name'] }}</h4>
        <p>Service des Ressources Humaines</p>
    </div>
    
    <div class="subject">
        <strong>Objet :</strong> Candidature pour le poste de {{ $data['position_title'] }}
    </div>
    
    <div class="content">
        {!! nl2br(e($content)) !!}
    </div>
    
    <div class="signature">
        <p>Cordialement,</p>
        <br>
        <p><strong>{{ $data['user_profile']->first_name ?? '' }} {{ $data['user_profile']->last_name ?? '' }}</strong></p>
    </div>
</body>
</html>

