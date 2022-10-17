#![feature(prelude_import)]
#[prelude_import]
use std::prelude::rust_2021::*;
#[macro_use]
extern crate std;
use ink_lang as ink;
mod return_err {
    impl ::ink_lang::reflect::ContractEnv for ReturnErr {
        type Env = ::ink_env::DefaultEnvironment;
    }
    type Environment = <ReturnErr as ::ink_lang::reflect::ContractEnv>::Env;
    type AccountId =
        <<ReturnErr as ::ink_lang::reflect::ContractEnv>::Env as ::ink_env::Environment>::AccountId;
    type Balance =
        <<ReturnErr as ::ink_lang::reflect::ContractEnv>::Env as ::ink_env::Environment>::Balance;
    type Hash =
        <<ReturnErr as ::ink_lang::reflect::ContractEnv>::Env as ::ink_env::Environment>::Hash;
    type Timestamp =
        <<ReturnErr as ::ink_lang::reflect::ContractEnv>::Env as ::ink_env::Environment>::Timestamp;
    type BlockNumber = < < ReturnErr as :: ink_lang :: reflect :: ContractEnv > :: Env as :: ink_env :: Environment > :: BlockNumber ;
    #[cfg(not(feature = "__ink_dylint_Storage"))]
    pub struct ReturnErr {}
    const _: () = {
        impl ::ink_storage::traits::SpreadLayout for ReturnErr {
            #[allow(unused_comparisons)]
            const FOOTPRINT: ::core::primitive::u64 =
                [0u64, 0u64][(0u64 < 0u64) as ::core::primitive::usize];
            const REQUIRES_DEEP_CLEAN_UP: ::core::primitive::bool = (false || false);
            fn pull_spread(__key_ptr: &mut ::ink_storage::traits::KeyPtr) -> Self {
                ReturnErr {}
            }
            fn push_spread(&self, __key_ptr: &mut ::ink_storage::traits::KeyPtr) {
                match self {
                    ReturnErr {} => {}
                }
            }
            fn clear_spread(&self, __key_ptr: &mut ::ink_storage::traits::KeyPtr) {
                match self {
                    ReturnErr {} => {}
                }
            }
        }
    };
    const _: () = {
        impl ::ink_storage::traits::StorageLayout for ReturnErr {
            fn layout(
                __key_ptr: &mut ::ink_storage::traits::KeyPtr,
            ) -> ::ink_metadata::layout::Layout {
                ::ink_metadata::layout::Layout::Struct(
                    ::ink_metadata::layout::StructLayout::new([]),
                )
            }
        }
    };
    const _: () = {
        impl ::ink_lang::reflect::ContractName for ReturnErr {
            const NAME: &'static str = "ReturnErr";
        }
        impl ::ink_lang::codegen::ContractRootKey for ReturnErr {
            const ROOT_KEY: ::ink_primitives::Key = ::ink_primitives::Key::new([0x00; 32]);
        }
    };
    const _: () = {
        impl<'a> ::ink_lang::codegen::Env for &'a ReturnErr {
            type EnvAccess =
                ::ink_lang::EnvAccess<'a, <ReturnErr as ::ink_lang::reflect::ContractEnv>::Env>;
            fn env(self) -> Self::EnvAccess {
                <<Self as ::ink_lang::codegen::Env>::EnvAccess as ::core::default::Default>::default(
                )
            }
        }
        impl<'a> ::ink_lang::codegen::StaticEnv for ReturnErr {
            type EnvAccess = ::ink_lang::EnvAccess<
                'static,
                <ReturnErr as ::ink_lang::reflect::ContractEnv>::Env,
            >;
            fn env() -> Self::EnvAccess {
                < < Self as :: ink_lang :: codegen :: StaticEnv > :: EnvAccess as :: core :: default :: Default > :: default ()
            }
        }
    };
    const _: () = {
        #[allow(unused_imports)]
        use ::ink_lang::codegen::{Env as _, StaticEnv as _};
    };
    impl ::ink_lang::reflect::ContractAmountDispatchables for ReturnErr {
        const MESSAGES: ::core::primitive::usize = 1usize;
        const CONSTRUCTORS: ::core::primitive::usize = 1usize;
    }
    impl
        ::ink_lang::reflect::ContractDispatchableMessages<
            { <ReturnErr as ::ink_lang::reflect::ContractAmountDispatchables>::MESSAGES },
        > for ReturnErr
    {
        const IDS: [::core::primitive::u32;
            <ReturnErr as ::ink_lang::reflect::ContractAmountDispatchables>::MESSAGES] =
            [0x633AA551_u32];
    }
    impl
        ::ink_lang::reflect::ContractDispatchableConstructors<
            { <ReturnErr as ::ink_lang::reflect::ContractAmountDispatchables>::CONSTRUCTORS },
        > for ReturnErr
    {
        const IDS: [::core::primitive::u32;
            <ReturnErr as ::ink_lang::reflect::ContractAmountDispatchables>::CONSTRUCTORS] =
            [0x9BAE9D5E_u32];
    }
    impl ::ink_lang::reflect::DispatchableConstructorInfo<0x9BAE9D5E_u32> for ReturnErr {
        type Input = ();
        type Storage = ReturnErr;
        const CALLABLE: fn(Self::Input) -> Self::Storage = |_| ReturnErr::new();
        const PAYABLE: ::core::primitive::bool = false;
        const SELECTOR: [::core::primitive::u8; 4usize] = [0x9B_u8, 0xAE_u8, 0x9D_u8, 0x5E_u8];
        const LABEL: &'static ::core::primitive::str = "new";
    }
    impl ::ink_lang::reflect::DispatchableMessageInfo<0x633AA551_u32> for ReturnErr {
        type Input = ();
        type Output = Result<()>;
        type Storage = ReturnErr;
        const CALLABLE: fn(&mut Self::Storage, Self::Input) -> Self::Output =
            |storage, _| ReturnErr::flip(storage);
        const SELECTOR: [::core::primitive::u8; 4usize] = [0x63_u8, 0x3A_u8, 0xA5_u8, 0x51_u8];
        const PAYABLE: ::core::primitive::bool = false;
        const MUTATES: ::core::primitive::bool = true;
        const LABEL: &'static ::core::primitive::str = "flip";
    }
    const _: () = {
        #[allow(non_camel_case_types)]
        pub enum __ink_ConstructorDecoder {
            Constructor0(
                <ReturnErr as ::ink_lang::reflect::DispatchableConstructorInfo<
                    {
                        <ReturnErr as ::ink_lang::reflect::ContractDispatchableConstructors<
                            {
                                < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: CONSTRUCTORS
                            },
                        >>::IDS[0usize]
                    },
                >>::Input,
            ),
        }
        impl ::ink_lang::reflect::DecodeDispatch for __ink_ConstructorDecoder {
            fn decode_dispatch<I>(
                input: &mut I,
            ) -> ::core::result::Result<Self, ::ink_lang::reflect::DispatchError>
            where
                I: ::scale::Input,
            {
                match < [:: core :: primitive :: u8 ; 4usize] as :: scale :: Decode > :: decode (input) . map_err (| _ | :: ink_lang :: reflect :: DispatchError :: InvalidSelector) ? { < ReturnErr as :: ink_lang :: reflect :: DispatchableConstructorInfo < { < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableConstructors < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: CONSTRUCTORS } > > :: IDS [0usize] } > > :: SELECTOR => { :: core :: result :: Result :: Ok (Self :: Constructor0 (< < ReturnErr as :: ink_lang :: reflect :: DispatchableConstructorInfo < { < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableConstructors < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: CONSTRUCTORS } > > :: IDS [0usize] } > > :: Input as :: scale :: Decode > :: decode (input) . map_err (| _ | :: ink_lang :: reflect :: DispatchError :: InvalidParameters) ?)) } _invalid => :: core :: result :: Result :: Err (:: ink_lang :: reflect :: DispatchError :: UnknownSelector) , }
            }
        }
        impl ::scale::Decode for __ink_ConstructorDecoder {
            fn decode<I>(input: &mut I) -> ::core::result::Result<Self, ::scale::Error>
            where
                I: ::scale::Input,
            {
                <Self as ::ink_lang::reflect::DecodeDispatch>::decode_dispatch(input)
                    .map_err(::core::convert::Into::into)
            }
        }
        impl ::ink_lang::reflect::ExecuteDispatchable for __ink_ConstructorDecoder {
            #[allow(clippy::nonminimal_bool)]
            fn execute_dispatchable(
                self,
            ) -> ::core::result::Result<(), ::ink_lang::reflect::DispatchError> {
                match self {
                    Self::Constructor0(input) => {
                        if {
                            false
                                || <ReturnErr as ::ink_lang::reflect::DispatchableConstructorInfo<
                                    {
                                        < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableConstructors < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: CONSTRUCTORS } > > :: IDS [0usize]
                                    },
                                >>::PAYABLE
                        } && !<ReturnErr as ::ink_lang::reflect::DispatchableConstructorInfo<
                            {
                                < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableConstructors < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: CONSTRUCTORS } > > :: IDS [0usize]
                            },
                        >>::PAYABLE
                        {
                            ::ink_lang::codegen::deny_payment::<
                                <ReturnErr as ::ink_lang::reflect::ContractEnv>::Env,
                            >()?;
                        }
                        ::ink_lang::codegen::execute_constructor::<ReturnErr, _, _>(move || {
                            <ReturnErr as ::ink_lang::reflect::DispatchableConstructorInfo<
                                {
                                    < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableConstructors < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: CONSTRUCTORS } > > :: IDS [0usize]
                                },
                            >>::CALLABLE(input)
                        })
                    }
                }
            }
        }
        impl ::ink_lang::reflect::ContractConstructorDecoder for ReturnErr {
            type Type = __ink_ConstructorDecoder;
        }
    };
    const _: () = {
        #[allow(non_camel_case_types)]
        pub enum __ink_MessageDecoder {
            Message0(
                <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                    {
                        <ReturnErr as ::ink_lang::reflect::ContractDispatchableMessages<
                            {
                                < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES
                            },
                        >>::IDS[0usize]
                    },
                >>::Input,
            ),
        }
        impl ::ink_lang::reflect::DecodeDispatch for __ink_MessageDecoder {
            fn decode_dispatch<I>(
                input: &mut I,
            ) -> ::core::result::Result<Self, ::ink_lang::reflect::DispatchError>
            where
                I: ::scale::Input,
            {
                match < [:: core :: primitive :: u8 ; 4usize] as :: scale :: Decode > :: decode (input) . map_err (| _ | :: ink_lang :: reflect :: DispatchError :: InvalidSelector) ? { < ReturnErr as :: ink_lang :: reflect :: DispatchableMessageInfo < { < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableMessages < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES } > > :: IDS [0usize] } > > :: SELECTOR => { :: core :: result :: Result :: Ok (Self :: Message0 (< < ReturnErr as :: ink_lang :: reflect :: DispatchableMessageInfo < { < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableMessages < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES } > > :: IDS [0usize] } > > :: Input as :: scale :: Decode > :: decode (input) . map_err (| _ | :: ink_lang :: reflect :: DispatchError :: InvalidParameters) ?)) } _invalid => :: core :: result :: Result :: Err (:: ink_lang :: reflect :: DispatchError :: UnknownSelector) , }
            }
        }
        impl ::scale::Decode for __ink_MessageDecoder {
            fn decode<I>(input: &mut I) -> ::core::result::Result<Self, ::scale::Error>
            where
                I: ::scale::Input,
            {
                <Self as ::ink_lang::reflect::DecodeDispatch>::decode_dispatch(input)
                    .map_err(::core::convert::Into::into)
            }
        }
        static ROOT_KEY: ::ink_primitives::Key = ::ink_primitives::Key::new([0x00; 32]);
        fn push_contract(contract: ::core::mem::ManuallyDrop<ReturnErr>, mutates: bool) {
            if mutates {
                ::ink_storage::traits::push_spread_root::<ReturnErr>(&contract, &ROOT_KEY);
            }
        }
        impl ::ink_lang::reflect::ExecuteDispatchable for __ink_MessageDecoder {
            #[allow(clippy::nonminimal_bool, clippy::let_unit_value)]
            fn execute_dispatchable(
                self,
            ) -> ::core::result::Result<(), ::ink_lang::reflect::DispatchError> {
                let mut contract: ::core::mem::ManuallyDrop<ReturnErr> =
                    ::core::mem::ManuallyDrop::new(::ink_storage::traits::pull_spread_root::<
                        ReturnErr,
                    >(&ROOT_KEY));
                match self {
                    Self::Message0(input) => {
                        use ::core::default::Default;
                        if {
                            false
                                || <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                                    {
                                        < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableMessages < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES } > > :: IDS [0usize]
                                    },
                                >>::PAYABLE
                        } && !<ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                            {
                                <ReturnErr as ::ink_lang::reflect::ContractDispatchableMessages<
                                    {
                                        < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES
                                    },
                                >>::IDS[0usize]
                            },
                        >>::PAYABLE
                        {
                            ::ink_lang::codegen::deny_payment::<
                                <ReturnErr as ::ink_lang::reflect::ContractEnv>::Env,
                            >()?;
                        }
                        let result: <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                            {
                                <ReturnErr as ::ink_lang::reflect::ContractDispatchableMessages<
                                    {
                                        < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES
                                    },
                                >>::IDS[0usize]
                            },
                        >>::Output = <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                            {
                                <ReturnErr as ::ink_lang::reflect::ContractDispatchableMessages<
                                    {
                                        < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES
                                    },
                                >>::IDS[0usize]
                            },
                        >>::CALLABLE(&mut contract, input);
                        let failure = {
                            #[allow(unused_imports)]
                            use ::ink_lang::result_info::IsResultTypeFallback as _;
                            ::ink_lang::result_info::IsResultType::<
                                <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                                    {
                                        < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableMessages < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES } > > :: IDS [0usize]
                                    },
                                >>::Output,
                            >::VALUE
                        } && {
                            #[allow(unused_imports)]
                            use ::ink_lang::result_info::IsResultErrFallback as _;
                            ::ink_lang::result_info::IsResultErr(&result).value()
                        };
                        if failure {
                            ::ink_env::return_value::<
                                <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                                    {
                                        < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableMessages < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES } > > :: IDS [0usize]
                                    },
                                >>::Output,
                            >(
                                ::ink_env::ReturnFlags::default().set_reverted(true),
                                &result,
                            )
                        }
                        push_contract(
                            contract,
                            <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                                {
                                    < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableMessages < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES } > > :: IDS [0usize]
                                },
                            >>::MUTATES,
                        );
                        if ::core::any::TypeId::of::<
                            <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                                {
                                    < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableMessages < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES } > > :: IDS [0usize]
                                },
                            >>::Output,
                        >() != ::core::any::TypeId::of::<()>()
                        {
                            ::ink_env::return_value::<
                                <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                                    {
                                        < ReturnErr as :: ink_lang :: reflect :: ContractDispatchableMessages < { < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES } > > :: IDS [0usize]
                                    },
                                >>::Output,
                            >(::ink_env::ReturnFlags::default(), &result)
                        }
                    }
                };
                ::core::result::Result::Ok(())
            }
        }
        impl ::ink_lang::reflect::ContractMessageDecoder for ReturnErr {
            type Type = __ink_MessageDecoder;
        }
    };
    #[cfg(not(test))]
    #[cfg(not(feature = "ink-as-dependency"))]
    const _: () = {
        #[cfg(not(test))]
        #[no_mangle]
        #[allow(clippy::nonminimal_bool)]
        fn deploy() {
            if !{
                false
                    || <ReturnErr as ::ink_lang::reflect::DispatchableConstructorInfo<
                        {
                            <ReturnErr as ::ink_lang::reflect::ContractDispatchableConstructors<
                                {
                                    < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: CONSTRUCTORS
                                },
                            >>::IDS[0usize]
                        },
                    >>::PAYABLE
            } {
                ::ink_lang::codegen::deny_payment::<
                    <ReturnErr as ::ink_lang::reflect::ContractEnv>::Env,
                >()
                .unwrap_or_else(|error| ::core::panicking::panic_display(&error))
            }
            :: ink_env :: decode_input :: < < ReturnErr as :: ink_lang :: reflect :: ContractConstructorDecoder > :: Type > () . map_err (| _ | :: ink_lang :: reflect :: DispatchError :: CouldNotReadInput) . and_then (| decoder | { < < ReturnErr as :: ink_lang :: reflect :: ContractConstructorDecoder > :: Type as :: ink_lang :: reflect :: ExecuteDispatchable > :: execute_dispatchable (decoder) }) . unwrap_or_else (| error | { :: core :: panicking :: panic_fmt (:: core :: fmt :: Arguments :: new_v1 (& ["dispatching ink! constructor failed: "] , & [:: core :: fmt :: ArgumentV1 :: new_display (& error)])) })
        }
        #[cfg(not(test))]
        #[no_mangle]
        #[allow(clippy::nonminimal_bool)]
        fn call() {
            if !{
                false
                    || <ReturnErr as ::ink_lang::reflect::DispatchableMessageInfo<
                        {
                            <ReturnErr as ::ink_lang::reflect::ContractDispatchableMessages<
                                {
                                    < ReturnErr as :: ink_lang :: reflect :: ContractAmountDispatchables > :: MESSAGES
                                },
                            >>::IDS[0usize]
                        },
                    >>::PAYABLE
            } {
                ::ink_lang::codegen::deny_payment::<
                    <ReturnErr as ::ink_lang::reflect::ContractEnv>::Env,
                >()
                .unwrap_or_else(|error| ::core::panicking::panic_display(&error))
            }
            :: ink_env :: decode_input :: < < ReturnErr as :: ink_lang :: reflect :: ContractMessageDecoder > :: Type > () . map_err (| _ | :: ink_lang :: reflect :: DispatchError :: CouldNotReadInput) . and_then (| decoder | { < < ReturnErr as :: ink_lang :: reflect :: ContractMessageDecoder > :: Type as :: ink_lang :: reflect :: ExecuteDispatchable > :: execute_dispatchable (decoder) }) . unwrap_or_else (| error | { :: core :: panicking :: panic_fmt (:: core :: fmt :: Arguments :: new_v1 (& ["dispatching ink! message failed: "] , & [:: core :: fmt :: ArgumentV1 :: new_display (& error)])) })
        }
    };
    const _: () = {
        use ::ink_lang::codegen::{Env as _, StaticEnv as _};
        const _: ::ink_lang::codegen::utils::IsSameType<ReturnErr> =
            ::ink_lang::codegen::utils::IsSameType::<ReturnErr>::new();
        impl ReturnErr {
            #[cfg(not(feature = "__ink_dylint_Constructor"))]
            pub fn new() -> Self {
                Self {}
            }
            pub fn flip(&mut self) -> Result<()> {
                Result::Err(Error::Foo)
            }
        }
        const _: () = {
            ::ink_lang::codegen::utils::consume_type::<
                ::ink_lang::codegen::DispatchOutput<Result<()>>,
            >();
        };
    };
    const _: () = { # [doc = r" The ink! smart contract's call builder."] # [doc = r""] # [doc = r" Implements the underlying on-chain calling of the ink! smart contract"] # [doc = r" messages and trait implementations in a type safe way."] # [repr (transparent)] pub struct CallBuilder { account_id : AccountId , } # [automatically_derived] impl :: core :: fmt :: Debug for CallBuilder { fn fmt (& self , f : & mut :: core :: fmt :: Formatter) -> :: core :: fmt :: Result { :: core :: fmt :: Formatter :: debug_struct_field1_finish (f , "CallBuilder" , "account_id" , & & self . account_id) } } const _ : () = { impl :: ink_storage :: traits :: SpreadLayout for CallBuilder { # [allow (unused_comparisons)] const FOOTPRINT : :: core :: primitive :: u64 = [(0u64 + < AccountId as :: ink_storage :: traits :: SpreadLayout > :: FOOTPRINT) , 0u64] [((0u64 + < AccountId as :: ink_storage :: traits :: SpreadLayout > :: FOOTPRINT) < 0u64) as :: core :: primitive :: usize] ; const REQUIRES_DEEP_CLEAN_UP : :: core :: primitive :: bool = (false || (false || < AccountId as :: ink_storage :: traits :: SpreadLayout > :: REQUIRES_DEEP_CLEAN_UP)) ; fn pull_spread (__key_ptr : & mut :: ink_storage :: traits :: KeyPtr) -> Self { CallBuilder { account_id : < AccountId as :: ink_storage :: traits :: SpreadLayout > :: pull_spread (__key_ptr) , } } fn push_spread (& self , __key_ptr : & mut :: ink_storage :: traits :: KeyPtr) { match self { CallBuilder { account_id : __binding_0 } => { { :: ink_storage :: traits :: SpreadLayout :: push_spread (__binding_0 , __key_ptr) ; } } } } fn clear_spread (& self , __key_ptr : & mut :: ink_storage :: traits :: KeyPtr) { match self { CallBuilder { account_id : __binding_0 } => { { :: ink_storage :: traits :: SpreadLayout :: clear_spread (__binding_0 , __key_ptr) ; } } } } } } ; const _ : () = { impl :: ink_storage :: traits :: PackedLayout for CallBuilder { fn pull_packed (& mut self , __key : & :: ink_primitives :: Key) { match self { CallBuilder { account_id : __binding_0 } => { { :: ink_storage :: traits :: PackedLayout :: pull_packed (__binding_0 , __key) ; } } } } fn push_packed (& self , __key : & :: ink_primitives :: Key) { match self { CallBuilder { account_id : __binding_0 } => { { :: ink_storage :: traits :: PackedLayout :: push_packed (__binding_0 , __key) ; } } } } fn clear_packed (& self , __key : & :: ink_primitives :: Key) { match self { CallBuilder { account_id : __binding_0 } => { { :: ink_storage :: traits :: PackedLayout :: clear_packed (__binding_0 , __key) ; } } } } } } ; # [allow (deprecated)] const _ : () = { # [automatically_derived] impl :: scale :: Encode for CallBuilder { fn encode_to < __CodecOutputEdqy : :: scale :: Output + ? :: core :: marker :: Sized > (& self , __codec_dest_edqy : & mut __CodecOutputEdqy) { :: scale :: Encode :: encode_to (& & self . account_id , __codec_dest_edqy) } fn encode (& self) -> :: scale :: alloc :: vec :: Vec < :: core :: primitive :: u8 > { :: scale :: Encode :: encode (& & self . account_id) } fn using_encoded < R , F : :: core :: ops :: FnOnce (& [:: core :: primitive :: u8]) -> R > (& self , f : F) -> R { :: scale :: Encode :: using_encoded (& & self . account_id , f) } } # [automatically_derived] impl :: scale :: EncodeLike for CallBuilder { } } ; # [allow (deprecated)] const _ : () = { # [automatically_derived] impl :: scale :: Decode for CallBuilder { fn decode < __CodecInputEdqy : :: scale :: Input > (__codec_input_edqy : & mut __CodecInputEdqy) -> :: core :: result :: Result < Self , :: scale :: Error > { :: core :: result :: Result :: Ok (CallBuilder { account_id : { let __codec_res_edqy = < AccountId as :: scale :: Decode > :: decode (__codec_input_edqy) ; match __codec_res_edqy { :: core :: result :: Result :: Err (e) => return :: core :: result :: Result :: Err (e . chain ("Could not decode `CallBuilder::account_id`")) , :: core :: result :: Result :: Ok (__codec_res_edqy) => __codec_res_edqy , } } , }) } } } ; # [automatically_derived] impl :: core :: hash :: Hash for CallBuilder { fn hash < __H : :: core :: hash :: Hasher > (& self , state : & mut __H) -> () { :: core :: hash :: Hash :: hash (& self . account_id , state) } } impl :: core :: marker :: StructuralPartialEq for CallBuilder { } # [automatically_derived] impl :: core :: cmp :: PartialEq for CallBuilder { # [inline] fn eq (& self , other : & CallBuilder) -> bool { self . account_id == other . account_id } } impl :: core :: marker :: StructuralEq for CallBuilder { } # [automatically_derived] impl :: core :: cmp :: Eq for CallBuilder { # [inline] # [doc (hidden)] # [no_coverage] fn assert_receiver_is_total_eq (& self) -> () { let _ : :: core :: cmp :: AssertParamIsEq < AccountId > ; } } # [automatically_derived] impl :: core :: clone :: Clone for CallBuilder { # [inline] fn clone (& self) -> CallBuilder { CallBuilder { account_id : :: core :: clone :: Clone :: clone (& self . account_id) , } } } # [allow (non_upper_case_globals , unused_attributes , unused_qualifications)] const _ : () = { impl :: scale_info :: TypeInfo for CallBuilder { type Identity = Self ; fn type_info () -> :: scale_info :: Type { :: scale_info :: Type :: builder () . path (:: scale_info :: Path :: new ("CallBuilder" , "return_err::return_err")) . type_params (:: alloc :: vec :: Vec :: new ()) . docs (& ["The ink! smart contract's call builder." , "" , "Implements the underlying on-chain calling of the ink! smart contract" , "messages and trait implementations in a type safe way."]) . composite (:: scale_info :: build :: Fields :: named () . field (| f | f . ty :: < AccountId > () . name ("account_id") . type_name ("AccountId") . docs (& []))) } } ; } ; const _ : () = { impl :: ink_storage :: traits :: StorageLayout for CallBuilder { fn layout (__key_ptr : & mut :: ink_storage :: traits :: KeyPtr) -> :: ink_metadata :: layout :: Layout { :: ink_metadata :: layout :: Layout :: Struct (:: ink_metadata :: layout :: StructLayout :: new ([:: ink_metadata :: layout :: FieldLayout :: new (:: core :: option :: Option :: Some ("account_id") , < AccountId as :: ink_storage :: traits :: StorageLayout > :: layout (__key_ptr))])) } } } ; const _ : () = { impl :: ink_lang :: codegen :: ContractCallBuilder for ReturnErr { type Type = CallBuilder ; } impl :: ink_lang :: reflect :: ContractEnv for CallBuilder { type Env = < ReturnErr as :: ink_lang :: reflect :: ContractEnv > :: Env ; } } ; impl :: ink_env :: call :: FromAccountId < Environment > for CallBuilder { # [inline] fn from_account_id (account_id : AccountId) -> Self { Self { account_id } } } impl :: ink_lang :: ToAccountId < Environment > for CallBuilder { # [inline] fn to_account_id (& self) -> AccountId { < AccountId as :: core :: clone :: Clone > :: clone (& self . account_id) } } impl CallBuilder { # [allow (clippy :: type_complexity)] # [inline] pub fn flip (& mut self) -> :: ink_env :: call :: CallBuilder < Environment , :: ink_env :: call :: utils :: Set < :: ink_env :: call :: Call < Environment > > , :: ink_env :: call :: utils :: Set < :: ink_env :: call :: ExecutionInput < :: ink_env :: call :: utils :: EmptyArgumentList > > , :: ink_env :: call :: utils :: Set < :: ink_env :: call :: utils :: ReturnType < Result < () > > > > { :: ink_env :: call :: build_call :: < Environment > () . call_type (:: ink_env :: call :: Call :: new () . callee (:: ink_lang :: ToAccountId :: to_account_id (self))) . exec_input (:: ink_env :: call :: ExecutionInput :: new (:: ink_env :: call :: Selector :: new ([0x63_u8 , 0x3A_u8 , 0xA5_u8 , 0x51_u8]))) . returns :: < Result < () > > () } } };
    pub struct ReturnErrRef {
        inner: <ReturnErr as ::ink_lang::codegen::ContractCallBuilder>::Type,
    }
    #[automatically_derived]
    impl ::core::fmt::Debug for ReturnErrRef {
        fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
            ::core::fmt::Formatter::debug_struct_field1_finish(
                f,
                "ReturnErrRef",
                "inner",
                &&self.inner,
            )
        }
    }
    const _: () = {
        impl ::ink_storage::traits::SpreadLayout for ReturnErrRef {
            #[allow(unused_comparisons)]
            const FOOTPRINT : :: core :: primitive :: u64 = [(0u64 + < < ReturnErr as :: ink_lang :: codegen :: ContractCallBuilder > :: Type as :: ink_storage :: traits :: SpreadLayout > :: FOOTPRINT) , 0u64] [((0u64 + < < ReturnErr as :: ink_lang :: codegen :: ContractCallBuilder > :: Type as :: ink_storage :: traits :: SpreadLayout > :: FOOTPRINT) < 0u64) as :: core :: primitive :: usize] ;
            const REQUIRES_DEEP_CLEAN_UP : :: core :: primitive :: bool = (false || (false || < < ReturnErr as :: ink_lang :: codegen :: ContractCallBuilder > :: Type as :: ink_storage :: traits :: SpreadLayout > :: REQUIRES_DEEP_CLEAN_UP)) ;
            fn pull_spread(__key_ptr: &mut ::ink_storage::traits::KeyPtr) -> Self {
                ReturnErrRef { inner : < < ReturnErr as :: ink_lang :: codegen :: ContractCallBuilder > :: Type as :: ink_storage :: traits :: SpreadLayout > :: pull_spread (__key_ptr) , }
            }
            fn push_spread(&self, __key_ptr: &mut ::ink_storage::traits::KeyPtr) {
                match self {
                    ReturnErrRef { inner: __binding_0 } => {
                        ::ink_storage::traits::SpreadLayout::push_spread(__binding_0, __key_ptr);
                    }
                }
            }
            fn clear_spread(&self, __key_ptr: &mut ::ink_storage::traits::KeyPtr) {
                match self {
                    ReturnErrRef { inner: __binding_0 } => {
                        ::ink_storage::traits::SpreadLayout::clear_spread(__binding_0, __key_ptr);
                    }
                }
            }
        }
    };
    const _: () = {
        impl ::ink_storage::traits::PackedLayout for ReturnErrRef {
            fn pull_packed(&mut self, __key: &::ink_primitives::Key) {
                match self {
                    ReturnErrRef { inner: __binding_0 } => {
                        ::ink_storage::traits::PackedLayout::pull_packed(__binding_0, __key);
                    }
                }
            }
            fn push_packed(&self, __key: &::ink_primitives::Key) {
                match self {
                    ReturnErrRef { inner: __binding_0 } => {
                        ::ink_storage::traits::PackedLayout::push_packed(__binding_0, __key);
                    }
                }
            }
            fn clear_packed(&self, __key: &::ink_primitives::Key) {
                match self {
                    ReturnErrRef { inner: __binding_0 } => {
                        ::ink_storage::traits::PackedLayout::clear_packed(__binding_0, __key);
                    }
                }
            }
        }
    };
    #[allow(deprecated)]
    const _: () = {
        #[automatically_derived]
        impl ::scale::Encode for ReturnErrRef {
            fn encode_to<__CodecOutputEdqy: ::scale::Output + ?::core::marker::Sized>(
                &self,
                __codec_dest_edqy: &mut __CodecOutputEdqy,
            ) {
                ::scale::Encode::encode_to(&&self.inner, __codec_dest_edqy)
            }
            fn encode(&self) -> ::scale::alloc::vec::Vec<::core::primitive::u8> {
                ::scale::Encode::encode(&&self.inner)
            }
            fn using_encoded<R, F: ::core::ops::FnOnce(&[::core::primitive::u8]) -> R>(
                &self,
                f: F,
            ) -> R {
                ::scale::Encode::using_encoded(&&self.inner, f)
            }
        }
        #[automatically_derived]
        impl ::scale::EncodeLike for ReturnErrRef {}
    };
    #[allow(deprecated)]
    const _: () = {
        #[automatically_derived]
        impl ::scale::Decode for ReturnErrRef {
            fn decode<__CodecInputEdqy: ::scale::Input>(
                __codec_input_edqy: &mut __CodecInputEdqy,
            ) -> ::core::result::Result<Self, ::scale::Error> {
                ::core::result::Result::Ok(ReturnErrRef {
                    inner: {
                        let __codec_res_edqy = < < ReturnErr as :: ink_lang :: codegen :: ContractCallBuilder > :: Type as :: scale :: Decode > :: decode (__codec_input_edqy) ;
                        match __codec_res_edqy {
                            ::core::result::Result::Err(e) => {
                                return ::core::result::Result::Err(
                                    e.chain("Could not decode `ReturnErrRef::inner`"),
                                )
                            }
                            ::core::result::Result::Ok(__codec_res_edqy) => __codec_res_edqy,
                        }
                    },
                })
            }
        }
    };
    #[automatically_derived]
    impl ::core::hash::Hash for ReturnErrRef {
        fn hash<__H: ::core::hash::Hasher>(&self, state: &mut __H) -> () {
            ::core::hash::Hash::hash(&self.inner, state)
        }
    }
    impl ::core::marker::StructuralPartialEq for ReturnErrRef {}
    #[automatically_derived]
    impl ::core::cmp::PartialEq for ReturnErrRef {
        #[inline]
        fn eq(&self, other: &ReturnErrRef) -> bool {
            self.inner == other.inner
        }
    }
    impl ::core::marker::StructuralEq for ReturnErrRef {}
    #[automatically_derived]
    impl ::core::cmp::Eq for ReturnErrRef {
        #[inline]
        #[doc(hidden)]
        #[no_coverage]
        fn assert_receiver_is_total_eq(&self) -> () {
            let _: ::core::cmp::AssertParamIsEq<
                <ReturnErr as ::ink_lang::codegen::ContractCallBuilder>::Type,
            >;
        }
    }
    #[automatically_derived]
    impl ::core::clone::Clone for ReturnErrRef {
        #[inline]
        fn clone(&self) -> ReturnErrRef {
            ReturnErrRef {
                inner: ::core::clone::Clone::clone(&self.inner),
            }
        }
    }
    #[allow(non_upper_case_globals, unused_attributes, unused_qualifications)]
    const _: () = {
        impl ::scale_info::TypeInfo for ReturnErrRef {
            type Identity = Self;
            fn type_info() -> ::scale_info::Type {
                ::scale_info::Type::builder()
                    .path(::scale_info::Path::new(
                        "ReturnErrRef",
                        "return_err::return_err",
                    ))
                    .type_params(::alloc::vec::Vec::new())
                    .docs(&[])
                    .composite(::scale_info::build::Fields::named().field(|f| {
                        f.ty::<<ReturnErr as ::ink_lang::codegen::ContractCallBuilder>::Type>()
                            .name("inner")
                            .type_name(
                                "<ReturnErr as::ink_lang::codegen::ContractCallBuilder>::Type",
                            )
                            .docs(&[])
                    }))
            }
        };
    };
    const _: () = {
        impl ::ink_storage::traits::StorageLayout for ReturnErrRef {
            fn layout(
                __key_ptr: &mut ::ink_storage::traits::KeyPtr,
            ) -> ::ink_metadata::layout::Layout {
                :: ink_metadata :: layout :: Layout :: Struct (:: ink_metadata :: layout :: StructLayout :: new ([:: ink_metadata :: layout :: FieldLayout :: new (:: core :: option :: Option :: Some ("inner") , < < ReturnErr as :: ink_lang :: codegen :: ContractCallBuilder > :: Type as :: ink_storage :: traits :: StorageLayout > :: layout (__key_ptr))]))
            }
        }
    };
    const _: () = {
        impl ::ink_lang::reflect::ContractReference for ReturnErr {
            type Type = ReturnErrRef;
        }
        impl ::ink_lang::reflect::ContractEnv for ReturnErrRef {
            type Env = <ReturnErr as ::ink_lang::reflect::ContractEnv>::Env;
        }
    };
    impl ReturnErrRef {
        #[inline]
        #[allow(clippy::type_complexity)]
        pub fn new() -> ::ink_env::call::CreateBuilder<
            Environment,
            ::ink_env::call::utils::Unset<Hash>,
            ::ink_env::call::utils::Unset<u64>,
            ::ink_env::call::utils::Unset<Balance>,
            ::ink_env::call::utils::Set<
                ::ink_env::call::ExecutionInput<::ink_env::call::utils::EmptyArgumentList>,
            >,
            ::ink_env::call::utils::Unset<::ink_env::call::state::Salt>,
            Self,
        > {
            ::ink_env::call::build_create::<Environment, Self>().exec_input(
                ::ink_env::call::ExecutionInput::new(::ink_env::call::Selector::new([
                    0x9B_u8, 0xAE_u8, 0x9D_u8, 0x5E_u8,
                ])),
            )
        }
        #[inline]
        pub fn flip(&mut self) -> Result<()> {
            <Self as ::ink_lang::codegen::TraitCallBuilder>::call_mut(self)
                .flip()
                .fire()
                .unwrap_or_else(|error| {
                    ::core::panicking::panic_fmt(::core::fmt::Arguments::new_v1(
                        &["encountered error while calling ", "::", ": "],
                        &match (&"ReturnErr", &"flip", &error) {
                            args => [
                                ::core::fmt::ArgumentV1::new_display(args.0),
                                ::core::fmt::ArgumentV1::new_display(args.1),
                                ::core::fmt::ArgumentV1::new_debug(args.2),
                            ],
                        },
                    ))
                })
        }
    }
    const _: () = {
        impl ::ink_lang::codegen::TraitCallBuilder for ReturnErrRef {
            type Builder = <ReturnErr as ::ink_lang::codegen::ContractCallBuilder>::Type;
            #[inline]
            fn call(&self) -> &Self::Builder {
                &self.inner
            }
            #[inline]
            fn call_mut(&mut self) -> &mut Self::Builder {
                &mut self.inner
            }
        }
    };
    impl ::ink_env::call::FromAccountId<Environment> for ReturnErrRef {
        #[inline]
        fn from_account_id(account_id: AccountId) -> Self {
            Self { inner : < < ReturnErr as :: ink_lang :: codegen :: ContractCallBuilder > :: Type as :: ink_env :: call :: FromAccountId < Environment > > :: from_account_id (account_id) , }
        }
    }
    impl ::ink_lang::ToAccountId<Environment> for ReturnErrRef {
        #[inline]
        fn to_account_id(&self) -> AccountId {
            < < ReturnErr as :: ink_lang :: codegen :: ContractCallBuilder > :: Type as :: ink_lang :: ToAccountId < Environment > > :: to_account_id (& self . inner)
        }
    }
    #[cfg(feature = "std")]
    #[cfg(not(feature = "ink-as-dependency"))]
    const _: () = {
        #[no_mangle]
        pub fn __ink_generate_metadata() -> ::ink_metadata::InkProject {
            ::ink_metadata::InkProject::new(
                <ReturnErr as ::ink_storage::traits::StorageLayout>::layout(
                    &mut <::ink_primitives::KeyPtr as ::core::convert::From<
                        ::ink_primitives::Key,
                    >>::from(
                        <::ink_primitives::Key as ::core::convert::From<
                            [::core::primitive::u8; 32usize],
                        >>::from([0x00_u8; 32usize]),
                    ),
                ),
                ::ink_metadata::ContractSpec::new()
                    .constructors([::ink_metadata::ConstructorSpec::from_label("new")
                        .selector([0x9B_u8, 0xAE_u8, 0x9D_u8, 0x5E_u8])
                        .args([])
                        .payable(false)
                        .docs([])
                        .done()])
                    .messages([::ink_metadata::MessageSpec::from_label("flip")
                        .selector([0x63_u8, 0x3A_u8, 0xA5_u8, 0x51_u8])
                        .args([])
                        .returns(::ink_metadata::ReturnTypeSpec::new(
                            ::ink_metadata::TypeSpec::with_name_segs::<Result<()>, _>(
                                ::core::iter::IntoIterator::into_iter(["Result"])
                                    .map(::core::convert::AsRef::as_ref),
                            ),
                        ))
                        .mutates(true)
                        .payable(false)
                        .docs([])
                        .done()])
                    .events([])
                    .docs([])
                    .done(),
            )
        }
    };
    pub enum Error {
        Foo,
    }
    #[allow(non_upper_case_globals, unused_attributes, unused_qualifications)]
    const _: () = {
        impl ::scale_info::TypeInfo for Error {
            type Identity = Self;
            fn type_info() -> ::scale_info::Type {
                ::scale_info::Type::builder()
                    .path(::scale_info::Path::new("Error", "return_err::return_err"))
                    .type_params(::alloc::vec::Vec::new())
                    .docs(&[])
                    .variant(::scale_info::build::Variants::new().variant("Foo", |v| {
                        v.index(0usize as ::core::primitive::u8).docs(&[])
                    }))
            }
        };
    };
    #[allow(deprecated)]
    const _: () = {
        #[automatically_derived]
        impl ::scale::Encode for Error {
            fn encode_to<__CodecOutputEdqy: ::scale::Output + ?::core::marker::Sized>(
                &self,
                __codec_dest_edqy: &mut __CodecOutputEdqy,
            ) {
                match *self {
                    Error::Foo => {
                        __codec_dest_edqy.push_byte(0usize as ::core::primitive::u8);
                    }
                    _ => (),
                }
            }
        }
        #[automatically_derived]
        impl ::scale::EncodeLike for Error {}
    };
    #[allow(deprecated)]
    const _: () = {
        #[automatically_derived]
        impl ::scale::Decode for Error {
            fn decode<__CodecInputEdqy: ::scale::Input>(
                __codec_input_edqy: &mut __CodecInputEdqy,
            ) -> ::core::result::Result<Self, ::scale::Error> {
                match __codec_input_edqy
                    .read_byte()
                    .map_err(|e| e.chain("Could not decode `Error`, failed to read variant byte"))?
                {
                    __codec_x_edqy if __codec_x_edqy == 0usize as ::core::primitive::u8 => {
                        ::core::result::Result::Ok(Error::Foo)
                    }
                    _ => ::core::result::Result::Err(<_ as ::core::convert::Into<_>>::into(
                        "Could not decode `Error`, variant doesn't exist",
                    )),
                }
            }
        }
    };
    pub type Result<T> = core::result::Result<T, Error>;
}
