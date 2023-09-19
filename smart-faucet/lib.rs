//! A smart contract which demonstrates behavior of the `self.env().transfer()` function.
//! It transfers some of it's balance to the caller.

#![cfg_attr(not(feature = "std"), no_std, no_main)]
#![allow(clippy::new_without_default)]

#[ink::contract]
pub mod give_me {
    use ink::storage::Mapping;

    /// No storage is needed for this simple contract.
    #[ink(storage)]
    pub struct GiveMe {
        admin: AccountId,
        give_amount: Balance,
        timeout: BlockNumber,
        timeouts: Mapping<AccountId, BlockNumber>,
    }

    impl GiveMe {
        /// Creates a new instance of this contract.
        /// For the workshop purposes, we want the creator to be the admin.
        /// The initial faucet airdrop is 5 tokens.
        /// The initial timeout is 5 blocks.
        #[ink(constructor, payable)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            Self {
                admin: caller,
                give_amount: 5,
                timeout: 5,
                timeouts: Mapping::new(),
            }
        }

        /// Adjusts the amount of tokens to be airdropped.
        ///
        /// # Errors
        ///
        /// - Panics in case the caller is not the admin of a contract.
        #[ink(message)]
        pub fn change_amount(&mut self, amount: Balance) {
            let caller = self.env().caller();
            assert_eq!(caller, self.admin, "You are not the admin of the contract!");
            self.give_amount = amount;
            ink::env::debug_println!("Changed amount to: {}", amount);
        }

        /// Returns currently set airdrop amount.
        #[ink(message)]
        pub fn get_amount(&self) -> Balance {
            self.give_amount
        }

        /// Adjusts the timeout.
        ///
        /// # Errors
        ///
        /// - Panics in case the caller is not the admin of a contract.
        #[ink(message)]
        pub fn change_timeout(&mut self, timeout: BlockNumber) {
            let caller = self.env().caller();
            assert_eq!(caller, self.admin, "You are not the admin of the contract!");
            self.timeout = timeout;
            ink::env::debug_println!("Changed timeout to: {}", timeout);
        }

        /// Returns currently set timeout.
        #[ink(message)]
        pub fn get_timeout(&self) -> BlockNumber {
            self.timeout
        }

        /// Transfers set amount of tokens to the caller.
        ///
        /// # Errors
        ///
        /// - Panics in case the requested transfer exceeds the contract balance.
        /// - Panics in case the requested transfer would have brought this contract's
        ///   balance below the minimum balance (i.e. the chain's existential deposit).
        /// - Panics in case the timeout has not passed yet.
        /// - Panics in case the transfer failed for another reason.
        #[ink(message)]
        pub fn give_me(&mut self) {
            ink::env::debug_println!("requested value: {}", self.give_amount);
            ink::env::debug_println!("contract balance: {}", self.env().balance());

            let caller = self.env().caller();

            assert!(
                self.give_amount <= self.env().balance(),
                "insufficient funds!"
            );

            if let Some(call_block) = self.timeouts.get(caller) {
                let duration = self.env().block_number().saturating_sub(call_block);
                assert!(
                    duration > self.timeout,
                    "You still have {} blocks left before you can request tokens again.",
                    (self.timeout.saturating_sub(duration))
                );
            }

            if self.env().transfer(caller, self.give_amount).is_err() {
                panic!(
                    "requested transfer failed. this can be the case if the contract does not\
                     have sufficient free funds or if the transfer would have brought the\
                     contract's balance below minimum balance."
                )
            } else if caller != self.admin {
                self.timeouts.insert(caller, &self.env().block_number());
            }
        }

        /// Asserts that the token amount sent as payment with this call
        /// is exactly `10`. This method will fail otherwise, and the
        /// transaction would then be reverted.
        ///
        /// # Note
        ///
        /// The method needs to be annotated with `payable`; only then it is
        /// allowed to receive value as part of the call.
        #[ink(message, payable, selector = 0xCAFEBABE)]
        pub fn was_it_ten(&self) {
            ink::env::debug_println!("received payment: {}", self.env().transferred_value());
            assert!(self.env().transferred_value() == 10, "payment was not ten");
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn transfer_works() {
            // given
            let contract_balance = 100;
            let accounts = default_accounts();
            let mut give_me = create_contract(contract_balance);

            // when
            set_sender(accounts.eve);
            set_balance(accounts.eve, 0);
            give_me.give_me();

            // then
            assert_eq!(get_balance(accounts.eve), 5);
        }

        #[ink::test]
        #[should_panic(expected = "insufficient funds!")]
        fn transfer_fails_insufficient_funds() {
            // given
            let contract_balance = 100;
            let accounts = default_accounts();
            let mut give_me = create_contract(contract_balance);

            // when
            set_sender(accounts.alice);
            give_me.change_amount(120);

            set_sender(accounts.eve);
            give_me.give_me();

            // then
            // `give_me` must already have panicked here
        }

        #[ink::test]
        fn test_transferred_value() {
            use ink::codegen::Env;
            // given
            let accounts = default_accounts();
            let give_me = create_contract(100);
            let contract_account = give_me.env().account_id();

            // when
            // Push the new execution context which sets initial balances and
            // sets Eve as the caller
            set_balance(accounts.eve, 100);
            set_balance(contract_account, 0);
            set_sender(accounts.eve);

            // then
            // we use helper macro to emulate method invocation coming with payment,
            // and there must be no panic
            ink::env::pay_with_call!(give_me.was_it_ten(), 10);

            // and
            // balances should be changed properly
            let contract_new_balance = get_balance(contract_account);
            let caller_new_balance = get_balance(accounts.eve);

            assert_eq!(caller_new_balance, 100 - 10);
            assert_eq!(contract_new_balance, 10);
        }

        #[ink::test]
        #[should_panic(expected = "payment was not ten")]
        fn test_transferred_value_must_fail() {
            // given
            let accounts = default_accounts();
            let give_me = create_contract(100);

            // when
            // Push the new execution context which sets Eve as caller and
            // the `mock_transferred_value` as the value which the contract
            // will see as transferred to it.
            set_sender(accounts.eve);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(13);

            // then
            give_me.was_it_ten();
        }

        /// Creates a new instance of `GiveMe` with `initial_balance`.
        ///
        /// Returns the `contract_instance`.
        fn create_contract(initial_balance: Balance) -> GiveMe {
            let accounts = default_accounts();
            set_sender(accounts.alice);
            set_balance(contract_id(), initial_balance);
            GiveMe::new()
        }

        fn contract_id() -> AccountId {
            ink::env::test::callee::<ink::env::DefaultEnvironment>()
        }

        fn set_sender(sender: AccountId) {
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(sender);
        }

        fn default_accounts() -> ink::env::test::DefaultAccounts<ink::env::DefaultEnvironment> {
            ink::env::test::default_accounts::<ink::env::DefaultEnvironment>()
        }

        fn set_balance(account_id: AccountId, balance: Balance) {
            ink::env::test::set_account_balance::<ink::env::DefaultEnvironment>(account_id, balance)
        }

        fn get_balance(account_id: AccountId) -> Balance {
            ink::env::test::get_account_balance::<ink::env::DefaultEnvironment>(account_id)
                .expect("Cannot get account balance")
        }
    }

    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        use super::*;
        use ink_e2e::{ChainBackend, ContractsBackend, Error};
        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        #[ink_e2e::test]
        async fn e2e_sending_value_to_give_me_must_fail(
            mut client: ink_e2e::Client<C, E>,
        ) -> E2EResult<()> {
            // given
            let constructor = GiveMeRef::new();
            let contract_acc = client
                .instantiate("smart_faucet", &ink_e2e::alice(), constructor, 1000, None)
                .await
                .expect("instantiate failed");

            let mut contract_call = contract_acc.call::<GiveMe>();

            // when
            let transfer_res = client
                .call(&ink_e2e::bob(), &contract_call.give_me(), 10, None)
                .await;

            // then
            if let Err(Error::<ink::env::DefaultEnvironment>::CallDryRun(dry_run)) = transfer_res {
                let debug_message = String::from_utf8_lossy(&dry_run.debug_message);
                assert!(debug_message.contains("paid an unpayable message"))
            } else {
                panic!("Paying an unpayable message should fail")
            }
            Ok(())
        }

        #[ink_e2e::test]
        async fn e2e_contract_must_transfer_value_to_sender(
            mut client: ink_e2e::Client<C, E>,
        ) -> E2EResult<()> {
            // given
            let constructor = GiveMeRef::new();
            let contract_acc = client
                .instantiate("smart_faucet", &ink_e2e::alice(), constructor, 1337, None)
                .await
                .expect("instantiate failed");

            let mut contract_call = contract_acc.call::<GiveMe>();

            let balance_before: Balance = client
                .balance(contract_acc.account_id)
                .await
                .expect("getting balance failed");

            // when
            let change_amount = client
                .call(
                    &ink_e2e::alice(),
                    &contract_call.change_amount(120),
                    0,
                    None,
                )
                .await
                .expect("call failed");

            // then
            assert!(change_amount
                .debug_message()
                .contains("Changed amount to: 120"));

            //when
            let transfer_res = client
                .call(&ink_e2e::bob(), &contract_call.give_me(), 0, None)
                .await
                .expect("call failed");

            // then
            assert!(transfer_res
                .debug_message()
                .contains("requested value: 120\n"));

            let balance_after: Balance = client
                .balance(contract_acc.account_id)
                .await
                .expect("getting balance failed");
            assert_eq!(balance_before - balance_after, 120);

            //when
            let transfer_res = client
                .call(&ink_e2e::bob(), &contract_call.give_me(), 0, None)
                .await;

            // then
            if let Err(Error::<ink::env::DefaultEnvironment>::CallDryRun(dry_run)) = transfer_res {
                let debug_message = String::from_utf8_lossy(&dry_run.debug_message);
                assert!(debug_message
                    .contains("You still have 5 blocks left before you can request tokens again."))
            } else {
                panic!("Requesting before timeout must fail!")
            }

            Ok(())
        }
    }
}
