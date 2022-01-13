# Proyecto desafio para posicion solidity dev.

## Supuestos:

- Los retiros son totales (un usuario, una vez que se hace el deposito de recompensas, puede retirar todo el dinero cuando lo desee, como se ve en los ejemplos).
- Los depositos de recompensas se hacen cada 7 dias, por lo que se hace un chequeo que entre deposito y deposito haya al menos 604799 segundos (7 dias - 1 segundo), podria haberse puesto 6 dias tambien, pero crei conveniente tener algun control para esto.
- No se puede depositar recompensas si no hay depositos de usuarios (nadie podria sacarlos, ya que segun el ejemplo solo pueden sacarlo los que depositaron antes de la recompensa)
- Un usuario puede realizar varios depositos dentro de una misma "epoca" (intervalo entre un deposito y otro), que entraran en el siguiente deposito de recompensas.

## Informacion relevante

Direccion rinkeby: 0x9940B95cDAE949D50DbD8817C2Da19be7Ec49E7a
Comando hardhat para saber balance de contrato: npx hardhat balance


