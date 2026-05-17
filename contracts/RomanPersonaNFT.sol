// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title RomanPersonaNFT
 * @dev NFT che rappresenta l'indole romana di una persona (boro, pariolino, coatto)
 */
contract RomanPersonaNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;
    
    uint256 private _nextTokenId;
    
    // Struct per i metadati della persona
    struct PersonaMetadata {
        string nome;           // Nome della persona
        string zona;           // Zona di Roma (roma_centro, roma_nord, etc.)
        string persona;        // Indole (boro, pariolino, coatto, mix)
        string abitazione;     // Tipo di abitazione
        string capelli;        // Taglio di capelli
        string piatto;         // Piatto preferito
        uint256 timestamp;     // Quando è stato mintato
    }
    
    // Mapping tokenId => metadati
    mapping(uint256 => PersonaMetadata) public personaData;
    
    // Eventi
    event PersonaMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string nome,
        string persona
    );
    
    constructor() ERC721("Roman Persona NFT", "URBE") Ownable(msg.sender) {
        _nextTokenId = 1;
    }
    
    /**
     * @dev Minta un nuovo NFT con i metadati della persona
     */
    function mint(
        string memory _nome,
        string memory _zona,
        string memory _persona,
        string memory _abitazione,
        string memory _capelli,
        string memory _piatto
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(msg.sender, tokenId);
        
        // Salva i metadati on-chain
        personaData[tokenId] = PersonaMetadata({
            nome: _nome,
            zona: _zona,
            persona: _persona,
            abitazione: _abitazione,
            capelli: _capelli,
            piatto: _piatto,
            timestamp: block.timestamp
        });
        
        // Genera e setta il tokenURI
        string memory uri = generateTokenURI(tokenId);
        _setTokenURI(tokenId, uri);
        
        emit PersonaMinted(tokenId, msg.sender, _nome, _persona);
        
        return tokenId;
    }
    
    /**
     * @dev Genera il tokenURI con metadati on-chain in formato JSON base64
     */
    function generateTokenURI(uint256 tokenId) internal view returns (string memory) {
        PersonaMetadata memory metadata = personaData[tokenId];
        
        // Descrizione personalizzata in base alla persona
        string memory description = getPersonaDescription(metadata.persona);
        
        // URL dell'immagine in base alla persona
        string memory imageUrl = getPersonaImageUrl(metadata.persona);
        
        // Costruisce il JSON dei metadati
        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                metadata.nome,
                ' - ',
                metadata.persona,
                '", "description": "',
                description,
                '", "image": "',
                imageUrl,
                '", "attributes": [',
                '{"trait_type": "Persona", "value": "',
                metadata.persona,
                '"},',
                '{"trait_type": "Zona", "value": "',
                metadata.zona,
                '"},',
                '{"trait_type": "Abitazione", "value": "',
                metadata.abitazione,
                '"},',
                '{"trait_type": "Capelli", "value": "',
                metadata.capelli,
                '"},',
                '{"trait_type": "Piatto", "value": "',
                metadata.piatto,
                '"},',
                '{"trait_type": "Timestamp", "display_type": "date", "value": ',
                metadata.timestamp.toString(),
                '}]}'
            )
        );
        
        // Codifica in base64
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }
    
    /**
     * @dev Ritorna la descrizione in base all'indole
     */
    function getPersonaDescription(string memory persona) internal pure returns (string memory) {
        bytes32 personaHash = keccak256(abi.encodePacked(persona));
        
        if (personaHash == keccak256(abi.encodePacked("boro"))) {
            return "Boro autentico: diretto, verace e senza filtri. Vive Roma come un campo da calcetto.";
        } else if (personaHash == keccak256(abi.encodePacked("pariolino"))) {
            return "Pariolino di razza: estetica curata, Spritz sempre pieno e convinzione che la vita inizi a Ponte Milvio.";
        } else if (personaHash == keccak256(abi.encodePacked("coatto"))) {
            return "Coatto leggendario: un concentrato de romanita e rumore. Parla col cuore.";
        } else if (personaHash == keccak256(abi.encodePacked("boro-pariolino mix"))) {
            return "Pariolino col cuore da boro: scarpe lucide ma battuta pronta. Ha classe e panino con la porchetta insieme.";
        } else if (personaHash == keccak256(abi.encodePacked("boro-coatto mix"))) {
            return "Coatto zen: se scazza con chiunque ma poi medita sul raccordo. Caos organizzato e pace interiore.";
        } else if (personaHash == keccak256(abi.encodePacked("pariolino-coatto mix"))) {
            return "Boro soft-touch: sembra tranquillo, ma bastano due battute e diventa un meme vivente.";
        } else {
            return "Una persona romana autentica con un mix unico di caratteristiche.";
        }
    }
    
    /**
     * @dev Ritorna l'URL dell'immagine in base all'indole
     */
    function getPersonaImageUrl(string memory persona) internal pure returns (string memory) {
        bytes32 personaHash = keccak256(abi.encodePacked(persona));
        
        // Base URL di Vercel
        string memory baseUrl = "https://boro-coatto-pariolino.vercel.app";
        
        if (personaHash == keccak256(abi.encodePacked("boro"))) {
            return string(abi.encodePacked(baseUrl, "/Boro.png"));
        } else if (personaHash == keccak256(abi.encodePacked("pariolino"))) {
            return string(abi.encodePacked(baseUrl, "/Pariolino.png"));
        } else if (personaHash == keccak256(abi.encodePacked("coatto"))) {
            return string(abi.encodePacked(baseUrl, "/Coatto.png"));
        } else {
            // Per i mix, usa l'immagine del tipo dominante o un'immagine di default
            return string(abi.encodePacked(baseUrl, "/placeholder.png"));
        }
    }
    
    /**
     * @dev Ottiene tutti i metadati di un token
     */
    function getPersonaMetadata(uint256 tokenId) public view returns (PersonaMetadata memory) {
        require(ownerOf(tokenId) != address(0), "Token non esistente");
        return personaData[tokenId];
    }
    
    /**
     * @dev Ottiene l'indole di un token
     */
    function getPersona(uint256 tokenId) public view returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token non esistente");
        return personaData[tokenId].persona;
    }
    
    /**
     * @dev Override per supportare sia ERC721 che ERC721URIStorage
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override per supportare sia ERC721 che ERC721URIStorage
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}




